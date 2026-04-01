/**
 * Requerimientos Dietéticos de Referencia (RDAs / DRVs)
 * Basado en las recomendaciones de la Autoridad Europea de Seguridad Alimentaria (EFSA)
 * y ajustados para uso simplificado (OMS) donde corresponde.
 */

export const REQUERIMIENTOS_BASE = {
  macronutrientes: {
    // Rango aceptable en porcentaje del Valor Calórico Total (VCT)
    carbohidratos: 50, // 45-60%, usamos 50% por simplicidad
    grasas: 30, // 20-35%, usamos 30% por simplicidad
    // Fibra dietaria (g/día) - Adultas y Embarazadas
    fibra: 25,
  },
  micronutrientes: {
    // Sodio máximo seguro según OMS (mg/día)
    sodio: 2000, 
  }
};

/**
 * Función para calcular los objetivos nutricionales diarios de una paciente.
 * @param {number} edad Edad de la paciente en años.
 * @param {number} pesoMaternal Peso actual de la paciente en kg.
 * @param {number|string} semanasSemanales Semanas de gestación (ej: "12 sem + 3 días" o un número).
 * @returns {Object} Objeto con las metas de Kcal, Proteínas, Carbos, Grasas y Micronutrientes.
 */
export function calcularRequerimientosPaciente(edad, pesoMaternal, semanasSemanales) {
  // 1. Parsear el trimestre
  let trimestre = 1; // Default
  if (semanasSemanales) {
    // Asumimos que podemos recibir un string tipo "20 sem + 3 días" o un número
    const match = String(semanasSemanales).match(/(\d+)/);
    if (match) {
      const sem = parseInt(match[1]);
      if (sem >= 14 && sem < 28) trimestre = 2;
      else if (sem >= 28) trimestre = 3;
    }
  }

  // Sanitize Inputs
  const edadParsed = parseInt(edad) || 25; // Default 25 si no hay
  const pesoParsed = parseFloat(pesoMaternal) || 60; // Default 60 si no hay

  // 2. Energía (Kcal)
  // Normalmente la energía basal = Peso * 24 (Harris-Benedict simplificada) + factor de actividad leve.
  // Pero para simplicidad, usaremos un consumo promedio base de adulto de 2000 kcal o (Peso * 30).
  const kcalBase = pesoParsed * 30; 
  let adicionalKcal = 0;
  if (trimestre === 1) adicionalKcal = 70;
  else if (trimestre === 2) adicionalKcal = 260;
  else if (trimestre === 3) adicionalKcal = 500;
  
  const kcalMeta = kcalBase + adicionalKcal;

  // 3. Macronutrientes
  // Carbohidratos (50% de las kcal / 4 kcal/g)
  const metaCarbos = (kcalMeta * 0.50) / 4;
  
  // Grasas (30% de las kcal / 9 kcal/g)
  const metaGrasas = (kcalMeta * 0.30) / 9;

  // Proteínas (EFSA: 0.83 g/kg + extra embarazo)
  const proteinaBase = pesoParsed * 0.83;
  let adicionalProteina = 0;
  if (trimestre === 1) adicionalProteina = 1;
  else if (trimestre === 2) adicionalProteina = 9;
  else if (trimestre === 3) adicionalProteina = 28;
  
  const metaProteinas = proteinaBase + adicionalProteina;

  // 4. Micronutrientes (EFSA)
  // Calcio: 1000mg (<25 años), 950mg (>=25 años)
  const metaCalcio = edadParsed < 25 ? 1000 : 950;
  
  // Vitamina C: EFSA embarazada = 105mg
  const metaVitC = 105;
  
  // Hierro: EFSA embarazada = 16mg
  const metaHierro = 16;
  
  return {
    kcal: Math.round(kcalMeta),
    carbohidratos: Math.round(metaCarbos),
    proteinas: Math.round(metaProteinas),
    grasas: Math.round(metaGrasas),
    fibra: REQUERIMIENTOS_BASE.macronutrientes.fibra,
    vitaminaC: metaVitC,
    hierro: metaHierro,
    calcio: metaCalcio,
    sodio: REQUERIMIENTOS_BASE.micronutrientes.sodio
  };
}
