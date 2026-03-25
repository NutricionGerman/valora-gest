import React, { useState, useEffect } from 'react';
import { Save, CalendarHeart, Activity, Stethoscope, User, Heart, Zap, ClipboardList, AlertCircle, Info, Home, Users, GraduationCap, FileText, Pill, Baby, HelpCircle, X } from 'lucide-react';
import clsx from 'clsx';

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
    importance: "Representa un antecedente quirúrgico de importancia y puede influir en la feritilidad o en el riesgo de recurrencia."
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
    desc: "Fecha probable de parto estimada mediante la medida del feto en la primera ecografía actual.",
    importance: "Es la medida más precisa para datar el embarazo, especialmente si la FUM es incierta o irregular."
  },
  tipoEmbarazo: {
    title: "Tipo de Embarazo",
    desc: "Determina si el embarazo es de un solo feto (Simple) o más de uno (Múltiple).",
    importance: "Los embarazos múltiples tienen requerimientos nutricionales significativamente mayores y un riesgo elevado de complicaciones nutricionales y prematurez."
  }
};

export default function Anamnesis() {
  const [activeTab, setActiveTab] = useState('identificacion');
  const [activeHelp, setActiveHelp] = useState(null);
  const [formData, setFormData] = useState({
    // 1. DATOS DE IDENTIFICACIÓN
    nombre: '',
    edad: '',
    dni: '',
    telefono: '',
    nivelEducativo: '',
    ocupacion: '',
    domicilio: '',
    viveCon: '',
    redApoyo: 'Buena', // Buena, Regular, Sin apoyo
    motivoConsulta: '',

    // 2. ANTECEDENTES PERSONALES Y FAMILIARES
    enfDiabetes: false,
    enfHipertension: false,
    enfHipotiroidismo: false,
    enfRenal: false,
    enfCardiopatia: false,
    enfEspecifique: '',
    anemia: false,
    alergiasAlimentarias: false,
    alergiasCuales: '',
    cirugiasPrevias: false,
    tca: false,
    
    famDM2: false, famDM2Parent: '',
    famHTA: false, famHTAParent: '',
    famObesidad: false, famObesidadParent: '',
    famPreeclampsia: false, famPreeclampsiaParent: '',
    famPrematuridad: false, famPrematuridadParent: '',
    famDTN: false, famDTNParent: '',
    famOtros: '',

    // SUPLEMENTACIÓN Y MEDICAMENTOS
    suplAcidoFolico: false,
    suplHierro: false,
    suplCalcio: false,
    suplB12: false,
    suplVitaminaD: false,
    suplOtros: '',
    medicamentosActuales: '',

    // 3. ANTECEDENTES GINECO-OBSTÉTRICOS
    gestas: '',
    paras: '',
    cesareas: '',
    abortos: '',
    ectopicos: '',
    pesoHijo1: '', pesoHijo2: '', pesoHijo3: '', pesoHijo4: '',
    intervaloIntergenesico: '',
    
    compPrevPreeclampsia: false,
    compPrevDMGest: false,
    compPrevHemorragia: false,
    compPrevPrematuro: false,
    
    fum: '',
    fpp: '',
    fppEco: '',
    semanasGestacion: '',
    tipoEmbarazo: 'Simple', // Simple, Múltiple
    
    sintNauseas: false,
    sintVomitos: false,
    sintAcidez: false,
    sintEstreñimiento: false,
    sintPica: false,
    sintDisgeusia: false,
    sintPesadez: false,
    
    compActNinguna: true,
    compActDMGest: false,
    compActPreeclampsia: false,
    compActOtra: '',

    // 4. ESTILO DE VIDA
    consAlcohol: false, consAlcoholFrec: '',
    consTabaco: false, consTabacoCant: '',
    consOtras: '',
    
    actFisicaRealiza: false, actFisicaTipo: '', actFisicaFrec: '', actFisicaDur: '',
    suenoHoras: '', suenoInsomnio: false, suenoSomnolencia: false,
    estres: 'Bajo',
    seguridadAlimentaria: 'Acceso adecuado',
    preparaAlimentos: ''
  });

  // Calculation Logic (FUM -> FPP and Weeks)
  useEffect(() => {
    if (formData.fum) {
      const fumDate = new Date(formData.fum);
      if (!isNaN(fumDate.getTime())) {
        const fppDate = new Date(fumDate);
        fppDate.setDate(fppDate.getDate() + 7);
        fppDate.setMonth(fppDate.getMonth() - 3);
        fppDate.setFullYear(fppDate.getFullYear() + 1);
        
        const today = new Date();
        const diffTime = Math.abs(today - fumDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;

        setFormData(prev => ({
          ...prev,
          fpp: fppDate.toISOString().split('T')[0],
          semanasGestacion: `${weeks} sem + ${days} días`
        }));
      }
    }
  }, [formData.fum]);

  // Load and Migrate Logic
  useEffect(() => {
    const patientId = localStorage.getItem('current_paciente_id');
    const patientName = localStorage.getItem('current_paciente_nombre') || '';
    
    let saved = localStorage.getItem(`anamnesis_${patientId}`);
    
    if (!saved) {
      const oldData = localStorage.getItem(`filiacion_clinica_${patientId}`);
      if (oldData) {
        localStorage.setItem(`anamnesis_${patientId}`, oldData);
        saved = oldData;
      }
    }

    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(prev => ({
        ...prev,
        ...parsed,
        nombre: patientName
      }));
    } else {
      setFormData(prev => ({ ...prev, nombre: patientName }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = () => {
    const patientId = localStorage.getItem('current_paciente_id');
    localStorage.setItem(`anamnesis_${patientId}`, JSON.stringify(formData));
    alert('Anamnesis guardada exitosamente.');
  };

  const tabs = [
    { id: 'identificacion', label: 'Identificación', icon: User, color: 'text-blue-400' },
    { id: 'antecedentes', label: 'Antecedentes', icon: ClipboardList, color: 'text-yellow-400' },
    { id: 'gineco', label: 'Gineco-Obstétricos', icon: CalendarHeart, color: 'text-pink-400' },
    { id: 'estilo', label: 'Estilo de Vida', icon: Zap, color: 'text-green-400' }
  ];

  const renderRisk = (text) => (
    <div className="flex items-center text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded mt-1">
      <AlertCircle className="w-3 h-3 mr-1" /> Riesgo: {text}
    </div>
  );

  const renderImplication = (text) => (
    <div className="flex items-center text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded mt-1 shadow-inner">
      <Info className="w-3 h-3 mr-1" /> Implicación clínica: {text}
    </div>
  );

  const renderHelpIcon = (id) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        setActiveHelp(activeHelp === id ? null : id);
      }}
      className={clsx(
        "ml-1.5 p-0.5 rounded-full transition-all hover:scale-110",
        activeHelp === id ? "bg-pink-500 text-white animate-pulse" : "text-gray-500 hover:text-pink-400 hover:bg-pink-500/10"
      )}
    >
      <HelpCircle className="w-3 h-3" />
    </button>
  );

  const renderHelpBox = (id) => {
    if (activeHelp !== id || !helpContent[id]) return null;
    const info = helpContent[id];
    return (
      <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-4 mt-2 mb-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2">
          <button onClick={() => setActiveHelp(null)} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative z-10">
          <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-1 flex items-center">
            <Info className="w-3.5 h-3.5 mr-1.5" /> {info.title}
          </h4>
          <p className="text-sm text-gray-200 leading-relaxed mb-2">{info.desc}</p>
          <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] font-bold text-pink-400 block mb-1 uppercase">¿Por qué es importante?</span>
            <p className="text-xs text-gray-300 italic">{info.importance}</p>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Anamnesis</h2>
          <p className="text-gray-400 text-sm">Registro integral de historia clínica y estilo de vida.</p>
        </div>
        <button onClick={handleSave} className="flex items-center px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
          <Save className="w-5 h-5 mr-2" /> Guardar Todo
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className={clsx("w-4 h-4 mr-2", tab.color)} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[60vh] backdrop-blur-sm">
        
        {/* TAB 1: IDENTIFICACIÓN */}
        {activeTab === 'identificacion' && (
          <div className="animate-in fade-in space-y-6">
            <h3 className="text-lg font-semibold text-blue-400 flex items-center border-b border-white/10 pb-2">
              <User className="w-5 h-5 mr-2" /> 📋 1. DATOS DE IDENTIFICACIÓN
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 flex items-center"><User className="w-3 h-3 mr-1" /> Nombre Completo</label>
                <input type="text" value={formData.nombre} readOnly className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white/50 cursor-not-allowed outline-none mt-1" />
              </div>
              <div className="relative">
                <label className="text-sm text-gray-400 flex items-center">⭐ Edad actual</label>
                <input type="number" name="edad" value={formData.edad} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none mt-1" placeholder="Años" />
                {(parseInt(formData.edad) < 20 || parseInt(formData.edad) > 35) && renderRisk("<20 (adolescente) o >35 (materna avanzada)")}
              </div>
              <div>
                <label className="text-sm text-gray-400 flex items-center"><FileText className="w-3 h-3 mr-1" /> DNI/Identificación</label>
                <input type="text" name="dni" value={formData.dni} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-400">Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-400 flex items-center"><GraduationCap className="w-3 h-3 mr-1" /> Nivel Educativo</label>
                <input type="text" name="nivelEducativo" value={formData.nivelEducativo} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-400">Ocupación</label>
                <input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 flex items-center"><Home className="w-3 h-3 mr-1" /> Domicilio</label>
                <input type="text" name="domicilio" value={formData.domicilio} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none mt-1" />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm text-gray-400 flex items-center font-bold text-blue-300">⭐ Motivo de la Consulta / Objetivo</label>
                <textarea 
                  name="motivoConsulta" 
                  value={formData.motivoConsulta} 
                  onChange={handleChange} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none mt-1 min-h-[80px]" 
                  placeholder="Ej: Derivada por diabetes gestacional, control de rutina, pica..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 flex items-center"><Users className="w-3 h-3 mr-1" /> ¿Con quién vive?</label>
                <input type="text" name="viveCon" value={formData.viveCon} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none mt-1" />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm text-gray-400 block mb-2">Red de apoyo familiar</label>
                <div className="flex space-x-4">
                  {['Buena', 'Regular', 'Sin apoyo'].map(opt => (
                    <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                      <input type="radio" name="redApoyo" value={opt} checked={formData.redApoyo === opt} onChange={handleChange} className="w-4 h-4 text-blue-500 border-white/20 bg-black/40 focus:ring-blue-500" />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANTECEDENTES */}
        {activeTab === 'antecedentes' && (
          <div className="animate-in fade-in space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-yellow-400 flex items-center border-b border-white/10 pb-2 mb-4">
                <ClipboardList className="w-5 h-5 mr-2" /> 🩺 2. ANTECEDENTES PERSONALES Y FAMILIARES
              </h3>
              
              <div className="space-y-6">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <label className="text-sm text-gray-400 font-medium mb-3 block">⭐ ¿Padece alguna enfermedad crónica?</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { id: 'enfDiabetes', label: 'Diabetes' },
                      { id: 'enfHipertension', label: 'Hipertensión' },
                      { id: 'enfHipotiroidismo', label: 'Hipotiroidismo' },
                      { id: 'enfRenal', label: 'Enf. Renal' },
                      { id: 'enfCardiopatia', label: 'Cardiopatía' }
                    ].map(enf => (
                      <label key={enf.id} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" name={enf.id} checked={formData[enf.id]} onChange={handleChange} className="rounded border-white/20 bg-black/40 text-yellow-500 focus:ring-yellow-500" />
                        <span className="text-sm text-gray-300">{enf.label}</span>
                      </label>
                    ))}
                  </div>
                  <input type="text" name="enfEspecifique" value={formData.enfEspecifique} onChange={handleChange} placeholder="Especificar..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none mt-3 focus:border-yellow-500" />
                  {Object.values(formData).some(v => v === true) && renderImplication("Requieren intervención nutricional específica")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-3">
                    <label className="flex items-center justify-between text-sm text-gray-300">¿Anemia o deficiencia de micronutrientes?
                      <input type="checkbox" name="anemia" checked={formData.anemia} onChange={handleChange} className="ml-2 rounded border-white/20 bg-black/40" />
                    </label>
                    <label className="flex items-center justify-between text-sm text-gray-300">¿Cirugías previas (Digestivas)?
                      <input type="checkbox" name="cirugiasPrevias" checked={formData.cirugiasPrevias} onChange={handleChange} className="ml-2 rounded border-white/20 bg-black/40" />
                    </label>
                    <label className="flex items-center justify-between text-sm text-gray-300">¿Trastorno de la conducta alimentaria (TCA)?
                      <input type="checkbox" name="tca" checked={formData.tca} onChange={handleChange} className="ml-2 rounded border-white/20 bg-black/40" />
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm text-gray-300">¿Alergias o intolerancias alimentarias?
                      <input type="checkbox" name="alergiasAlimentarias" checked={formData.alergiasAlimentarias} onChange={handleChange} className="ml-2 rounded border-white/20 bg-black/40" />
                    </label>
                    {formData.alergiasAlimentarias && (
                      <input type="text" name="alergiasCuales" value={formData.alergiasCuales} onChange={handleChange} placeholder="¿Cuál?" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h6 className="text-sm font-semibold text-orange-400 flex items-center mb-4 uppercase tracking-wider">
                <Users className="w-4 h-4 mr-2" /> ANTECEDENTES FAMILIARES
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'famDM2', label: 'Diabetes tipo 2' },
                  { id: 'famHTA', label: 'Hipertensión arterial' },
                  { id: 'famObesidad', label: 'Obesidad' },
                  { id: 'famPreeclampsia', label: 'Preeclampsia' },
                  { id: 'famPrematuridad', label: 'Prematuridad' },
                  { id: 'famDTN', label: 'Defectos Tubo Neural' }
                ].map(fam => (
                  <div key={fam.id} className="flex items-center space-x-4 bg-black/20 p-2 rounded-lg border border-white/5">
                    <label className="flex items-center space-x-2 cursor-pointer w-40">
                      <input type="checkbox" name={fam.id} checked={formData[fam.id]} onChange={handleChange} className="rounded border-white/20 bg-black/40 text-orange-500" />
                      <span className="text-xs text-gray-300">{fam.label}</span>
                    </label>
                    <input type="text" name={`${fam.id}Parent`} value={formData[`${fam.id}Parent`]} onChange={handleChange} placeholder="Parentesco" className="flex-1 bg-black/40 border border-white/5 rounded px-2 py-1 text-xs text-white outline-none focus:border-orange-500" disabled={!formData[fam.id]} />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <input type="text" name="famOtros" value={formData.famOtros} onChange={handleChange} placeholder="Otros antecedentes familiares relevantes..." className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
            </section>

            <section className="bg-yellow-500/5 border border-yellow-500/10 p-5 rounded-2xl">
              <h6 className="text-sm font-semibold text-yellow-300 flex items-center mb-4 uppercase tracking-wider">
                <Pill className="w-4 h-4 mr-2" /> SUPLEMENTACIÓN Y MEDICAMENTOS
              </h6>
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-gray-400 block mb-3 font-medium">¿Consume suplementos nutricionales?</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { id: 'suplAcidoFolico', label: 'Ác. Fólico' },
                      { id: 'suplHierro', label: 'Hierro' },
                      { id: 'suplCalcio', label: 'Calcio' },
                      { id: 'suplB12', label: 'Vit. B12' },
                      { id: 'suplVitaminaD', label: 'Vit. D' }
                    ].map(supl => (
                      <label key={supl.id} className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg border border-white/5 cursor-pointer">
                        <input type="checkbox" name={supl.id} checked={formData[supl.id]} onChange={handleChange} className="text-yellow-500" />
                        <span className="text-xs text-gray-300">{supl.label}</span>
                      </label>
                    ))}
                  </div>
                  <input type="text" name="suplOtros" value={formData.suplOtros} onChange={handleChange} placeholder="Otros suplementos..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white mt-3" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-2 font-medium">Medicamentos Actuales</label>
                  <textarea name="medicamentosActuales" value={formData.medicamentosActuales} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none min-h-[60px]" placeholder="Ej: Levotiroxina, Aspirina, etc." />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: GINECO-OBSTÉTRICOS */}
        {activeTab === 'gineco' && (
          <div className="animate-in fade-in space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-pink-400 flex items-center border-b border-white/10 pb-2 mb-4">
                <CalendarHeart className="w-5 h-5 mr-2" /> 🤰 3. ANTECEDENTES GINECO-OBSTÉTRICOS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                {[
                  { name: 'gestas', label: 'Gestas (G)', helpId: 'gestas' },
                  { name: 'paras', label: 'Partos (P)', helpId: 'paras' },
                  { name: 'cesareas', label: 'Cesáreas (C)', helpId: 'cesareas' },
                  { name: 'abortos', label: 'Abortos', helpId: 'abortos' },
                  { name: 'ectopicos', label: 'Ectópicos', helpId: 'ectopicos' }
                ].map(field => (
                  <div key={field.name}>
                    <label className="text-xs text-gray-400 flex items-center mb-1">
                      {field.label} {renderHelpIcon(field.helpId)}
                    </label>
                    <input type="number" name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-pink-500 outline-none" />
                  </div>
                ))}
              </div>

              {activeHelp && ['gestas', 'paras', 'cesareas', 'abortos', 'ectopicos'].includes(activeHelp) && (
                <div className="col-span-full">
                  {renderHelpBox(activeHelp)}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm text-gray-300 flex items-center">⭐ Peso hijos al nacer (kg)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <input key={n} type="number" name={`pesoHijo${n}`} value={formData[`pesoHijo${n}`]} onChange={handleChange} placeholder={`${n}°`} className="bg-black/20 border border-white/10 rounded-lg px-2 py-2 text-center text-white text-sm" />
                    ))}
                  </div>
                  {([formData.pesoHijo1, formData.pesoHijo2, formData.pesoHijo3, formData.pesoHijo4].some(p => p > 4)) && renderImplication("Macrosomía (>4kg): sospecha de diabetes gestacional")}
                  {([formData.pesoHijo1, formData.pesoHijo2, formData.pesoHijo3, formData.pesoHijo4].some(p => p > 0 && p < 2.5)) && renderRisk("Bajo peso (<2.5kg): riesgo de restricción de crecimiento")}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 flex items-center">
                    ⭐ Intervalo intergenésico (meses) {renderHelpIcon('intervaloIntergenesico')}
                  </label>
                  {renderHelpBox('intervaloIntergenesico')}
                  <input type="number" name="intervaloIntergenesico" value={formData.intervaloIntergenesico} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="Ej: 24" />
                  {formData.intervaloIntergenesico && parseInt(formData.intervaloIntergenesico) < 24 ? renderRisk("< 24 meses: elevado riesgo") : (formData.intervaloIntergenesico && parseInt(formData.intervaloIntergenesico) >= 24 ? <div className="text-[10px] text-green-400 mt-1">✓ Adecuado (&gt;= 24 meses)</div> : null)}
                </div>
              </div>

              <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5">
                <label className="text-sm text-gray-300 font-medium mb-3 block">Complicaciones en embarazos anteriores:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'compPrevPreeclampsia', label: 'Preeclampsia' },
                    { id: 'compPrevDMGest', label: 'DM Gestacional' },
                    { id: 'compPrevHemorragia', label: 'Hemorragia PP' },
                    { id: 'compPrevPrematuro', label: 'Parto Prematuro' }
                  ].map(c => (
                    <label key={c.id} className="flex items-center space-x-2 cursor-pointer group">
                      <input type="checkbox" name={c.id} checked={formData[c.id]} onChange={handleChange} className="rounded border-white/20 bg-black/40 text-pink-500" />
                      <span className="text-xs text-gray-400 group-hover:text-pink-300 transition-colors flex items-center">
                        {c.label} {c.id === 'compPrevPreeclampsia' && renderHelpIcon('preeclampsia')}
                      </span>
                    </label>
                  ))}
                </div>
                {renderHelpBox('preeclampsia')}
              </div>
            </section>

            <section className="bg-pink-500/5 border border-pink-500/10 p-6 rounded-2xl space-y-6">
              <h3 className="text-md font-bold text-pink-300 uppercase tracking-widest flex items-center">
                <Baby className="w-5 h-5 mr-2" /> EMBARAZO ACTUAL
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs text-gray-400 flex items-center mb-1">⭐ FUM {renderHelpIcon('fum')}</label>
                  {renderHelpBox('fum')}
                  <input type="date" name="fum" value={formData.fum} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm [color-scheme:dark]" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">⭐ Edad Gestacional</label>
                  <input type="text" value={formData.semanasGestacion} readOnly className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-pink-400 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center mb-1">⭐ Tipo {renderHelpIcon('tipoEmbarazo')}</label>
                  {renderHelpBox('tipoEmbarazo')}
                  <select name="tipoEmbarazo" value={formData.tipoEmbarazo} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                    <option>Simple</option><option>Múltiple</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center mb-1">FPP (Eco) {renderHelpIcon('fppEco')}</label>
                  {renderHelpBox('fppEco')}
                  <input type="date" name="fppEco" value={formData.fppEco} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm [color-scheme:dark]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs text-gray-400 font-bold mb-3 block">Síntomas Actuales:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'sintNauseas', label: 'Náuseas' },
                      { id: 'sintVomitos', label: 'Vómitos' },
                      { id: 'sintAcidez', label: 'Acidez' },
                      { id: 'sintEstreñimiento', label: 'Estreñimiento' },
                      { id: 'sintPica', label: 'Pica (deseos inusuales)' },
                      { id: 'sintDisgeusia', label: 'Altera. Gusto' },
                      { id: 'sintPesadez', label: 'Pesadez' }
                    ].map(s => (
                      <label key={s.id} className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg border border-white/5 cursor-pointer">
                        <input type="checkbox" name={s.id} checked={formData[s.id]} onChange={handleChange} className="rounded border-white/20 bg-black/40 text-pink-400" />
                        <span className="text-xs text-gray-300">{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold mb-3 block">Complicaciones Actuales:</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'compActNinguna', label: 'Ninguna' },
                        { id: 'compActDMGest', label: 'DM Gestacional' },
                        { id: 'compActPreeclampsia', label: 'Preeclampsia' }
                      ].map(c => (
                        <label key={c.id} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" name={c.id} checked={formData[c.id]} onChange={handleChange} className="rounded border-white/20 bg-black/40 text-pink-400" />
                          <span className="text-xs text-gray-300">{c.label}</span>
                        </label>
                      ))}
                    </div>
                    <input type="text" name="compActOtra" value={formData.compActOtra} onChange={handleChange} placeholder="Otra..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: ESTILO DE VIDA */}
        {activeTab === 'estilo' && (
          <div className="animate-in fade-in space-y-8">
            <h3 className="text-lg font-semibold text-green-400 flex items-center border-b border-white/10 pb-2 mb-4">
              <Zap className="w-5 h-5 mr-2" /> 🏃 4. ESTILO DE VIDA
            </h3>
            
            <section className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-6">
              <div>
                <label className="text-sm font-bold text-red-400 flex items-center mb-3">⭐ SUSTANCIAS (Alcohol, Tabaco, Otras)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <label className="flex items-center space-x-2 text-xs text-gray-300 mb-2">
                      <input type="checkbox" name="consAlcohol" checked={formData.consAlcohol} onChange={handleChange} className="text-red-500" /> <span>Alcohol</span>
                    </label>
                    <input type="text" name="consAlcoholFrec" value={formData.consAlcoholFrec} onChange={handleChange} placeholder="Frecuencia..." disabled={!formData.consAlcohol} className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white" />
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <label className="flex items-center space-x-2 text-xs text-gray-300 mb-2">
                      <input type="checkbox" name="consTabaco" checked={formData.consTabaco} onChange={handleChange} className="text-red-500" /> <span>Tabaco</span>
                    </label>
                    <input type="text" name="consTabacoCant" value={formData.consTabacoCant} onChange={handleChange} placeholder="Cigarrillos/día..." disabled={!formData.consTabaco} className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-gray-500 mb-1 block">Otras sustancias:</label>
                    <input type="text" name="consOtras" value={formData.consOtras} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                </div>
                {(formData.consAlcohol || formData.consTabaco || formData.consOtras) && renderImplication("Alcohol/Tabaco/Drogas: Requieren intervención inmediata")}
              </div>

              <div>
                <label className="text-sm font-bold text-green-400 flex items-center mb-3">ACTIVIDAD FÍSICA</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <label className="flex items-center space-x-2 text-xs text-gray-300 col-span-4 mb-2">
                    <input type="checkbox" name="actFisicaRealiza" checked={formData.actFisicaRealiza} onChange={handleChange} className="text-green-500" /> <span>¿Realiza actividad física actualmente?</span>
                  </label>
                  <input type="text" name="actFisicaTipo" value={formData.actFisicaTipo} onChange={handleChange} placeholder="Tipo..." disabled={!formData.actFisicaRealiza} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white" />
                  <input type="text" name="actFisicaFrec" value={formData.actFisicaFrec} onChange={handleChange} placeholder="Veces/Semana..." disabled={!formData.actFisicaRealiza} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white" />
                  <input type="number" name="actFisicaDur" value={formData.actFisicaDur} onChange={handleChange} placeholder="Minutos..." disabled={!formData.actFisicaRealiza} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-300">SUEÑO Y ESTRÉS</label>
                  <div className="flex items-center space-x-4">
                    <input type="number" name="suenoHoras" value={formData.suenoHoras} onChange={handleChange} placeholder="Horas..." className="w-24 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white" />
                    <label className="flex items-center space-x-1 text-xs text-gray-400"><input type="checkbox" name="suenoInsomnio" checked={formData.suenoInsomnio} onChange={handleChange} /> <span>Insomnio</span></label>
                    <label className="flex items-center space-x-1 text-xs text-gray-400"><input type="checkbox" name="suenoSomnolencia" checked={formData.suenoSomnolencia} onChange={handleChange} /> <span>Somnolencia</span></label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block">Nivel de estrés percibido:</label>
                    <div className="flex gap-4">
                      {['Bajo', 'Moderado', 'Alto', 'Muy alto'].map(v => (
                        <label key={v} className="flex items-center space-x-1 cursor-pointer">
                          <input type="radio" name="estres" value={v} checked={formData.estres === v} onChange={handleChange} />
                          <span className="text-[10px] text-gray-400">{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-300">SEGURIDAD ALIMENTARIA</label>
                  <select name="seguridadAlimentaria" value={formData.seguridadAlimentaria} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-green-500">
                    <option>Acceso adecuado</option>
                    <option>Acceso limitado</option>
                    <option>Inseguridad alimentaria</option>
                  </select>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">¿Quién prepara los alimentos en el hogar?</label>
                    <input type="text" name="preparaAlimentos" value={formData.preparaAlimentos} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
}

