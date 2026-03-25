const helpContent = {
  gestas: {
    title: "Gestas (G)",
    desc: "Número total de embarazos realizados por la mujer, independientemente de su resultado o duración, incluyendo el embarazo actual.",
    importance: "Ayuda a identificar la paridad y posibles riesgos acumulados de salud reproductiva."
  },
  paras: {
    title: "Partos (P)",
    desc: "Número de nacimientos con una edad gestacional mayor a 20-22 semanas (viables).",
    importance: "Es un indicador de la experiencia obstétrica previa y la capacidad de llevar un embarazo a término."
  },
  cesareas: {
    title: "Cesáreas (C)",
    desc: "Nacimientos ocurridos mediante intervención quirúrgica abdominal.",
    importance: "Antecedentes de cesárea aumentan el riesgo de complicaciones como placenta previa o rotura uterina en embarazos posteriores."
  },
  abortos: {
    title: "Abortos",
    desc: "Pérdida del embarazo antes de las 20-22 semanas de gestación.",
    importance: "Antecedentes de múltiples abortos pueden indicar la necesidad de estudios genéticos o mayor vigilancia por riesgo de parto prematuro."
  },
  ectopicos: {
    title: "Ectópicos",
    desc: "Embarazo que se implanta fuera de la cavidad uterina (frecuentemente en las trompas de Falopio).",
    importance: "Representa un antecedente quirúrgico de importancia y puede influir en la fertilidad o en el riesgo de recurrencia."
  },
  intervaloIntergenesico: {
    title: "Intervalo Intergenésico",
    desc: "Tiempo transcurrido entre el último evento de parto y el primer día de la última menstruación (FUM) del embarazo actual.",
    importance: "Un intervalo < 24 meses aumenta el riesgo de prematurez, bajo peso al nacer y agotamiento de reservas nutricionales maternas (anemia)."
  },
  preeclampsia: {
    title: "Preeclampsia",
    desc: "Trastorno hipertensivo del embarazo que suele aparecer después de la semana 20.",
    importance: "Su antecedente es un factor de riesgo mayor para la recurrencia en el embarazo actual y puede afectar el crecimiento fetal."
  },
  fum: {
    title: "FUM (Fecha de Última Menstruación)",
    desc: "Primer día del último sangrado menstrual normal relatado por la paciente.",
    importance: "Es el estándar para calcular la edad gestacional y la fecha probable de parto (FPP)."
  },
  fppEco: {
    title: "FPP (Ecografía)",
    desc: "Fecha probable de parto estimada mediante la medida del feto en la primera ecografía.",
    importance: "Es la medida más precisa para datar el embarazo, especialmente si la FUM es incierta o irregular."
  },
  tipoEmbarazo: {
    title: "Tipo de Embarazo",
    desc: "Determina si el embarazo es de un solo feto (Simple) o más de uno (Múltiple).",
    importance: "Los embarazos múltiples tienen requerimientos nutricionales significativamente mayores y un riesgo elevado de complicaciones nutricionales y prematurez."
  }
};
