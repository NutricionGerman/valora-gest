/**
 * Información clínica sobre deficiencias nutricionales extraída de la 
 * "Guía Completa de Deficiencias Nutricionales" (Abril 2026).
 */

export const infoClinica = {
  vit_a: {
    nombre: "Vitamina A",
    resumen: "Ceguera nocturna y xeroftalmia clínica.",
    signos: {
      cutaneos: "Piel seca (xerosis), hiperqueratosis folicular.",
      neurologicos: "Ceguera nocturna (hemeralopía), disminución de agudeza visual.",
      musculoesqueleticos: "Retraso del crecimiento, dolor óseo.",
      gastrointestinales: "Diarrea, falta de apetito.",
      sistemicos: "Infecciones frecuentes, anemia, infertilidad."
    },
    riesgo: "Niños en crecimiento, personas con malabsorción de grasas.",
    fuentes: "Hígado, zanahoria, espinaca, lácteos."
  },
  vit_d: {
    nombre: "Vitamina D",
    resumen: "Raquitismo en niños y osteomalacia en adultos.",
    signos: {
      cutaneos: "Caída del cabello, sudoración excesiva en cabeza (lactantes).",
      neurologicos: "Depresión, fatiga crónica, deterioro cognitivo.",
      musculoesqueleticos: "Dolor óseo, fracturas, debilidad muscular proximal.",
      gastrointestinales: "Malabsorción de calcio.",
      sistemicos: "Mayor riesgo cardiovascular, asma grave en niños."
    },
    riesgo: "Poca exposición solar, ancianos, obesidad.",
    fuentes: "Luz solar, pescado azul, yema de huevo."
  },
  vit_e: {
    nombre: "Vitamina E",
    resumen: "Neuropatía periférica y anemia hemolítica en prematuros.",
    signos: {
      cutaneos: "Piel seca, pérdida de elasticidad.",
      neurologicos: "Neuropatía periférica, ataxia, pérdida de reflejos.",
      musculoesqueleticos: "Debilidad muscular progresiva.",
      gastrointestinales: "Esteatorrea.",
      sistemicos: "Sistema inmunitario débil, retinopatía."
    },
    riesgo: "Prematuros, fibrosis quística, celíacos.",
    fuentes: "Aceites vegetales, nueces, almendras."
  },
  vit_k: {
    nombre: "Vitamina K",
    resumen: "Sangrado excesivo y hematomas frecuentes.",
    signos: {
      cutaneos: "Hematomas fáciles, petequias, sangrado de encías.",
      neurologicos: "Hemorragia intracraneal (en neonatos).",
      musculoesqueleticos: "Osteopenia, osteoporosis.",
      gastrointestinales: "Melena (heces negras), hemorragias digestivas.",
      sistemicos: "Hemorragia posparto, hematuria."
    },
    riesgo: "Recién nacidos, uso prolongado de antibióticos.",
    fuentes: "Hojas verdes (espinaca, col), brócoli."
  },
  b1: {
    nombre: "Vitamina B1 (Tiamina)",
    resumen: "Beriberi y síndrome de Wernicke-Korsakoff.",
    signos: {
      cutaneos: "Edema (beriberi húmedo), piel brillante.",
      neurologicos: "Neuropatía, confusión, ataxia, amnesia.",
      musculoesqueleticos: "Debilidad muscular, atrofia.",
      gastrointestinales: "Náuseas, estreñimiento.",
      sistemicos: "Insuficiencia cardíaca, taquicardia."
    },
    riesgo: "Alcohólicos, dietas altas en carbohidratos refinados.",
    fuentes: "Cerdo, cereales integrales, legumbres."
  },
  b2: {
    nombre: "Vitamina B2 (Riboflavina)",
    resumen: "Queilosis y glositis magenta.",
    signos: {
      cutaneos: "Fisuras labiales (queilosis), estomatitis angular.",
      neurologicos: "Fotofobia, visión borrosa.",
      musculoesqueleticos: "Crecimiento deficiente.",
      gastrointestinales: "Diarrea, úlceras.",
      sistemicos: "Anemia normocítica, fatiga."
    },
    riesgo: "Bajo consumo de lácteos, vegetarianos estrictos.",
    fuentes: "Leche, huevos, carnes, hígado."
  },
  b3: {
    nombre: "Vitamina B3 (Niacina)",
    resumen: "Pelagra: Dermatitis, Demencia y Diarrea.",
    signos: {
      cutaneos: "Dermatitis pigmentada en zonas expuestas.",
      neurologicos: "Demencia, confusión, depresión.",
      musculoesqueleticos: "Debilidad muscular.",
      gastrointestinales: "Diarrea profusa, glositis roja.",
      sistemicos: "Las 4 D: Dermatitis, Demencia, Diarrea y Death (muerte)."
    },
    riesgo: "Dietas basadas en maíz no tratado, alcoholismo.",
    fuentes: "Carnes, pescado, cacahuetes."
  },
  b5: {
    nombre: "Vitamina B5 (Ácido Pantoténico)",
    resumen: "Fatiga crónica y parestesias.",
    signos: {
      cutaneos: "Dermatitis, canas prematuras.",
      neurologicos: "Fatiga, insomnio, irritabilidad, parestesias.",
      musculoesqueleticos: "Calambres, espasmos.",
      gastrointestinales: "Náuseas, cólicos.",
      sistemicos: "Infecciones frecuentes, disfunción suprarrenal."
    },
    riesgo: "Malnutrición severa.",
    fuentes: "Carnes, huevos, aguacate, legumbres."
  },
  b6: {
    nombre: "Vitamina B6 (Piridoxina)",
    resumen: "Anemia microcítica y neuropatía.",
    signos: {
      cutaneos: "Dermatitis seborreica, queilitis.",
      neurologicos: "Convulsiones (neonatos), depresión, confusión.",
      musculoesqueleticos: "Fatiga muscular.",
      gastrointestinales: "Náuseas, glositis.",
      sistemicos: "Anemia microcítica hipocrómica."
    },
    riesgo: "Ancianos, pacientes renales, uso de isoniazida.",
    fuentes: "Pollo, pescado, papas, plátanos."
  },
  b7: {
    nombre: "Vitamina B7 (Biotina)",
    resumen: "Alopecia y dermatitis periorbital.",
    signos: {
      cutaneos: "Alopecia, rash periorbital, piel escamosa.",
      neurologicos: "Letargo, alucinaciones, parestesias.",
      musculoesqueleticos: "Dolor muscular.",
      gastrointestinales: "Pérdida de apetito.",
      sistemicos: "Conjuntivitis, infecciones recurrentes."
    },
    riesgo: "Consumo de claras de huevo crudas, anticonvulsivantes.",
    fuentes: "Yema de huevo, hígado, soya."
  },
  b9: {
    nombre: "Vitamina B9 (Ácido Fólico)",
    resumen: "Defectos del tubo neural y anemia megaloblástica.",
    signos: {
      cutaneos: "Palidez, glositis (lengua roja y lisa).",
      neurologicos: "Irritabilidad, confusión, cefalea.",
      musculoesqueleticos: "Debilidad generalizada.",
      gastrointestinales: "Diarrea, pérdida de peso.",
      sistemicos: "Espina bífida fetal, anemia megaloblástica."
    },
    riesgo: "Mujeres embarazadas, alcohólicos.",
    fuentes: "Hojas verdes, legumbres, cítricos."
  },
  b12: {
    nombre: "Vitamina B12 (Cobalamina)",
    resumen: "Neuropatía periférica y anemia megaloblástica.",
    signos: {
      cutaneos: "Glositis de Hunter, palidez amarillenta.",
      neurologicos: "Parestesias, demencia, psicosis, dificultad al caminar.",
      musculoesqueleticos: "Debilidad muscular.",
      gastrointestinales: "Pérdida de peso, estreñimiento.",
      sistemicos: "Anemia megaloblástica, infertilidad."
    },
    riesgo: "Veganos, ancianos con aclorhidria, bypass gástrico.",
    fuentes: "Carnes, mariscos, huevos, lácteos."
  },
  vit_c: {
    nombre: "Vitamina C",
    resumen: "Escorbuto con encías sangrantes y mala cicatrización.",
    signos: {
      cutaneos: "Encías sangrantes, petequias, pelos en tirabuzón.",
      neurologicos: "Depresión, fatiga, letargo.",
      musculoesqueleticos: "Dolor articular, hemartrosis.",
      gastrointestinales: "Pérdida de apetito.",
      sistemicos: "Hematomas, anemia por falta de absorción de hierro."
    },
    riesgo: "Fumadores, personas sin acceso a frutas/verduras frescas.",
    fuentes: "Cítricos, kiwi, pimiento rojo, tomate."
  },
  hierro: {
    nombre: "Hierro (Fe)",
    resumen: "Anemia ferropénica y pica (pagofagia).",
    signos: {
      cutaneos: "Palidez extrema, uñas en cuchara (coiloniquia).",
      neurologicos: "Mareos, cefalea, pica (deseo de comer hielo/tierra).",
      musculoesqueleticos: "Cansancio muscular.",
      gastrointestinales: "Dificultad para tragar (disfagia).",
      sistemicos: "Taquicardia, palpitaciones, síndrome de piernas inquietas."
    },
    riesgo: "Mujeres con menstruación abundante, embarazadas.",
    fuentes: "Carnes rojas, hígado, legumbres, espinaca."
  },
  calcio: {
    nombre: "Calcio (Ca)",
    resumen: "Osteoporosis y tetania (espasmos musculares).",
    signos: {
      cutaneos: "Uñas quebradizas, piel seca.",
      neurologicos: "Entumecimiento peribucal, confusión, tetania.",
      musculoesqueleticos: "Fracturas frecuentes, calambres, raquitismo.",
      gastrointestinales: "Calambres abdominales.",
      sistemicos: "Preeclampsia en embarazo, arritmias."
    },
    riesgo: "Menopausia, intolerancia a la lactosa.",
    fuentes: "Lácteos, sardinas con hueso, brócoli."
  },
  zinc: {
    nombre: "Zinc (Zn)",
    resumen: "Mala cicatrización, alopecia y pérdida de gusto.",
    signos: {
      cutaneos: "Alopecia, cicatrización lenta, estrías blancas en uñas.",
      neurologicos: "Pérdida de gusto y olfato (hipogeusia).",
      musculoesqueleticos: "Retraso del crecimiento.",
      gastrointestinales: "Diarrea crónica.",
      sistemicos: "Inmunodepresión, hipogonadismo."
    },
    riesgo: "Niños en crecimiento, embarazadas.",
    fuentes: "Ostras, carnes rojas, semillas de calabaza."
  },
  magnesio: {
    nombre: "Magnesio (Mg)",
    resumen: "Calambres, arritmias e insomnio.",
    signos: {
      cutaneos: "Visible fasciculación muscular.",
      neurologicos: "Insomnio, ansiedad, confusión, temblores.",
      musculoesqueleticos: "Calambres, espasmos persistentes.",
      gastrointestinales: "Náuseas.",
      sistemicos: "Taquicardia, hipertensión, fatiga."
    },
    riesgo: "Diabéticos, alcohólicos, pacientes con diarrea.",
    fuentes: "Chocolate negro, almendras, espinacas."
  },
  potasio: {
    nombre: "Potasio (K)",
    resumen: "Debilidad extrema, parálisis flácida y arritmias.",
    signos: {
      cutaneos: "Debilidad muscular visible.",
      neurologicos: "Fatiga extrema, parálisis flácida.",
      musculoesqueleticos: "Debilidad muscular profunda, calambres.",
      gastrointestinales: "Estreñimiento severo, íleo paralítico.",
      sistemicos: "Arritmias graves (fibrilación), poliuria."
    },
    riesgo: "Uso de diuréticos, vómitos crónicos.",
    fuentes: "Plátano, papa, tomate, aguacate."
  },
  sodio: {
    nombre: "Sodio (Na)",
    resumen: "Hiponatremia: Edema cerebral y convulsiones.",
    signos: {
      cutaneos: "Piel seca o edema.",
      neurologicos: "Cefalea, confusión, letargo, convulsiones.",
      musculoesqueleticos: "Debilidad, calambres.",
      gastrointestinales: "Náuseas, pérdida de apetito.",
      sistemicos: "Hipotensión, shock, muerte."
    },
    riesgo: "Ancianos, uso de diuréticos, sudoración excesiva.",
    fuentes: "Sal de mesa, alimentos procesados."
  },
  fosforo: {
    nombre: "Fósforo (P)",
    resumen: "Debilidad muscular y raquitismo.",
    signos: {
      cutaneos: "Fragilidad cutánea.",
      neurologicos: "Confusión, parestesias.",
      musculoesqueleticos: "Dolor óseo, fracturas, osteomalacia.",
      gastrointestinales: "Anorexia, náuseas.",
      sistemicos: "Insuficiencia respiratoria, anemia hemolítica."
    },
    riesgo: "Alcohólicos, malnutrición severa.",
    fuentes: "Carnes, lácteos, legumbres."
  },
  proteinas: {
    nombre: "Proteínas",
    resumen: "Kwashiorkor (edema) y Marasmo (emaciación).",
    signos: {
      cutaneos: "Edema (anasarca), úlceras, pelo rojizo.",
      neurologicos: "Letargo, apatía, retraso cognitivo.",
      musculoesqueleticos: "Atrofia muscular severa.",
      gastrointestinales: "Hígado graso (hepatomegalia), esteatorrea.",
      sistemicos: "Mortalidad elevada, baja inmunidad."
    },
    riesgo: "Niños en países en desarrollo, ancianos, cáncer.",
    fuentes: "Carnes, huevos, legumbres, quinoa."
  },
  omega_3_ALA: {
    nombre: "Ácidos Grasos Esenciales",
    resumen: "Dermatitis seca, inflamación y deterioro cognitivo.",
    signos: {
      cutaneos: "Dermatitis seca y escamosa.",
      neurologicos: "Deterioro cognitivo, depresión.",
      musculoesqueleticos: "Retraso del crecimiento.",
      gastrointestinales: "Hígado graso.",
      sistemicos: "Cicatrización deficiente, riesgo cardiovascular."
    },
    riesgo: "Dietas muy bajas en grasas, malabsorción.",
    fuentes: "Pescado azul, semillas de lino, chía, nueces."
  }
};
