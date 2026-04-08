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
    // Sodio Ingesta Adecuada según IOM (mg/día)
    sodio: 1500, 
    // Ácidos Grasos Esenciales - Ingesta Adecuada (IA)
    omega_6_LA: 13,
    omega_3_ALA: 1.4,
    // Vitaminas y Minerales (RDA/IA para Embarazo)
    vitamina_b6: 1.9,
    vitamina_d: 15,
    vitamina_k: 90,
    vitamina_e: 15,
    magnesio: 350,
    cobre: 1.0,
    selenio: 60
  }
};

/**
 * Función para calcular los objetivos nutricionales diarios de una paciente.
 */
export function calcularRequerimientosPaciente(edad, pesoMaternal, semanasSemanales) {
  let trimestre = 1;
  if (semanasSemanales) {
    const match = String(semanasSemanales).match(/(\d+)/);
    if (match) {
      const sem = parseInt(match[1]);
      if (sem >= 14 && sem < 28) trimestre = 2;
      else if (sem >= 28) trimestre = 3;
    }
  }

  const edadParsed = parseInt(edad) || 25;
  const pesoParsed = parseFloat(pesoMaternal) || 60;

  const kcalBase = pesoParsed * 30; 
  let adicionalKcal = 0;
  if (trimestre === 1) adicionalKcal = 70;
  else if (trimestre === 2) adicionalKcal = 260;
  else if (trimestre === 3) adicionalKcal = 500;
  
  const kcalMeta = kcalBase + adicionalKcal;

  const metaCarbos = (kcalMeta * 0.50) / 4;
  const metaGrasas = (kcalMeta * 0.30) / 9;

  const proteinaBase = pesoParsed * 0.83;
  let adicionalProteina = 0;
  if (trimestre === 1) adicionalProteina = 1;
  else if (trimestre === 2) adicionalProteina = 9;
  else if (trimestre === 3) adicionalProteina = 28;
  
  const metaProteinas = proteinaBase + adicionalProteina;

  return {
    kcal: Math.round(kcalMeta),
    carbohidratos: Math.round(metaCarbos),
    proteinas: Math.round(metaProteinas),
    grasas: Math.round(metaGrasas),
    fibra: REQUERIMIENTOS_BASE.macronutrientes.fibra,
    vitaminaC: 105,
    hierro: 16,
    calcio: edadParsed < 25 ? 1000 : 950,
    sodio: REQUERIMIENTOS_BASE.micronutrientes.sodio,
    omega_6_LA: REQUERIMIENTOS_BASE.micronutrientes.omega_6_LA,
    omega_3_ALA: REQUERIMIENTOS_BASE.micronutrientes.omega_3_ALA,
    b6: REQUERIMIENTOS_BASE.micronutrientes.vitamina_b6,
    vitamina_d: REQUERIMIENTOS_BASE.micronutrientes.vitamina_d,
    vitamina_k: REQUERIMIENTOS_BASE.micronutrientes.vitamina_k,
    vitamina_e: REQUERIMIENTOS_BASE.micronutrientes.vitamina_e,
    magnesio: REQUERIMIENTOS_BASE.micronutrientes.magnesio,
    cobre: REQUERIMIENTOS_BASE.micronutrientes.cobre,
    selenio: REQUERIMIENTOS_BASE.micronutrientes.selenio
  };
}
