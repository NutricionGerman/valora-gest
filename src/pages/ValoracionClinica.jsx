import React, { useState, useEffect } from 'react';
import { Save, Activity, Stethoscope, Droplets, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export default function ValoracionClinica() {
  const [activeTab, setActiveTab] = useState('vitales');

  const [vitales, setVitales] = useState({
    paSistolica: '',
    paDiastolica: '',
    clasificacionPA: 'Normal'
  });

  const [examenFisico, setExamenFisico] = useState({
    aspectoGeneral: { alerta: '', nutricional: '' },
    pielFaneras: { coloracion: '', turgor: '', hidratacion: '', lesiones: [], edema: '', cabello: '' },
    ojos: { conjuntivas: '', esclerotica: '', xerosis: false, manchasBitot: false },
    cavidadOral: { lengua: '', labios: '', encias: '', dientes: '' },
    unas: { aspecto: '' },
    musculoEsqueletico: { masa: '', deformidades: false, deformidadesDetalle: '' },
    abdomen: { alturaUterina: '', perimetro: '', fcf: '', movimientos: '', dolor: '' }
  });

  const [deficiencias, setDeficiencias] = useState([
    { id: 'fe1', nutriente: 'HIERRO', signo: 'Palidez cutáneo-mucosa, glositis, coiloniquia, fatiga', presente: false, severidad: '' },
    { id: 'fe2', nutriente: 'HIERRO', signo: 'Conjuntivas pálidas, uñas quebradizas', presente: false, severidad: '' },
    { id: 'vitA1', nutriente: 'VITAMINA A', signo: 'Xerosis cutánea, hiperqueratosis folicular', presente: false, severidad: '' },
    { id: 'vitA2', nutriente: 'VITAMINA A', signo: 'Xerosis conjuntival, manchas de Bitot', presente: false, severidad: '' },
    { id: 'vitC1', nutriente: 'VITAMINA C', signo: 'Encías inflamadas/sangrantes, equimosis', presente: false, severidad: '' },
    { id: 'vitC2', nutriente: 'VITAMINA C', signo: 'Petequias, cicatrización lenta', presente: false, severidad: '' },
    { id: 'vitD1', nutriente: 'VITAMINA D', signo: 'Dolor óseo, debilidad muscular', presente: false, severidad: '' },
    { id: 'vitD2', nutriente: 'VITAMINA D', signo: 'Calambres, fracturas patológicas', presente: false, severidad: '' },
    { id: 'b12_1', nutriente: 'B12 / FOLATO', signo: 'Glositis, queilitis angular, palidez', presente: false, severidad: '' },
    { id: 'b12_2', nutriente: 'B12 / FOLATO', signo: 'Lengua roja/lisa, parestesias', presente: false, severidad: '' },
    { id: 'zn1', nutriente: 'ZINC', signo: 'Dermatitis, alopecia, lesiones cutáneas', presente: false, severidad: '' },
    { id: 'zn2', nutriente: 'ZINC', signo: 'Cicatrización lenta, pérdida del gusto', presente: false, severidad: '' },
    { id: 'prot1', nutriente: 'PROTEÍNAS', signo: 'Edema, emaciación muscular', presente: false, severidad: '' },
    { id: 'prot2', nutriente: 'PROTEÍNAS', signo: 'Cabello decolorado/quebradizo, dermatosis', presente: false, severidad: '' }
  ]);

  const [hidratacion, setHidratacion] = useState({
    evaluacionGlobal: 'Adecuada',
    vasosAgua: '',
    signos: ''
  });

  const [resumen, setResumen] = useState({
    hallazgos: '',
    signosAlarma: [],
    observaciones: ''
  });

  useEffect(() => {
    const patientId = localStorage.getItem('current_paciente_id');
    const saved = localStorage.getItem(`valoracion_clinica_${patientId}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.vitales) setVitales(data.vitales);
      if (data.examenFisico) {
        setExamenFisico(prev => ({
          ...prev,
          ...data.examenFisico,
          aspectoGeneral: { ...prev.aspectoGeneral, ...(data.examenFisico.aspectoGeneral || {}) },
          pielFaneras: { ...prev.pielFaneras, ...(data.examenFisico.pielFaneras || {}) },
          ojos: { ...prev.ojos, ...(data.examenFisico.ojos || {}) },
          cavidadOral: { ...prev.cavidadOral, ...(data.examenFisico.cavidadOral || {}) },
          unas: { ...prev.unas, ...(data.examenFisico.unas || {}) },
          musculoEsqueletico: { ...prev.musculoEsqueletico, ...(data.examenFisico.musculoEsqueletico || {}) },
          abdomen: { ...prev.abdomen, ...(data.examenFisico.abdomen || {}) }
        }));
      }
      if (data.deficiencias && Array.isArray(data.deficiencias)) {
        setDeficiencias(data.deficiencias);
      }
      if (data.hidratacion) setHidratacion(data.hidratacion);
      if (data.resumen) setResumen(data.resumen);
    }
  }, []);

  // Update PA Classification automatically
  useEffect(() => {
    const sys = parseInt(vitales.paSistolica);
    const dia = parseInt(vitales.paDiastolica);
    if (!sys || !dia) return;

    if (sys >= 160 || dia >= 110) setVitales(prev => ({ ...prev, clasificacionPA: 'Preeclampsia' }));
    else if (sys >= 140 || dia >= 90) setVitales(prev => ({ ...prev, clasificacionPA: 'Hipertensión gestacional' }));
    else if (sys >= 120 && sys < 140) setVitales(prev => ({ ...prev, clasificacionPA: 'Elevada' }));
    else setVitales(prev => ({ ...prev, clasificacionPA: 'Normal' }));
  }, [vitales.paSistolica, vitales.paDiastolica]);

  const handleSave = () => {
    const patientId = localStorage.getItem('current_paciente_id');
    localStorage.setItem(`valoracion_clinica_${patientId}`, JSON.stringify({
      vitales, examenFisico, deficiencias, hidratacion, resumen
    }));
    alert('Valoración Clínica guardada exitosamente.');
  };

  const toggleAlarma = (signo) => {
    setResumen(prev => {
      const currentAlarmas = Array.isArray(prev.signosAlarma) ? prev.signosAlarma : [];
      return {
        ...prev,
        signosAlarma: currentAlarmas.includes(signo)
          ? currentAlarmas.filter(s => s !== signo)
          : [...currentAlarmas, signo]
      };
    });
  };

  const handleExamenChange = (section, field, value) => {
    setExamenFisico(prev => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value }
    }));
  };

  const handleDeficienciaChange = (id, field, value) => {
    setDeficiencias(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleLesion = (lesion) => {
    setExamenFisico(prev => ({
      ...prev,
      pielFaneras: {
        ...prev.pielFaneras,
        lesiones: prev.pielFaneras.lesiones.includes(lesion)
          ? prev.pielFaneras.lesiones.filter(l => l !== lesion)
          : [...prev.pielFaneras.lesiones, lesion]
      }
    }));
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Valoración Clínica</h2>
          <p className="text-gray-400 text-sm">Registro de examen físico y signos de deficiencias.</p>
        </div>
        <button onClick={handleSave} className="flex items-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20">
          <Save className="w-5 h-5 mr-2" /> Guardar Valoración
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
        {[
          { id: 'vitales', label: 'Vitales y Alerta', icon: Activity, color: 'text-red-400' },
          { id: 'examen', label: 'Examen Físico', icon: Stethoscope, color: 'text-blue-400' },
          { id: 'deficiencias', label: 'Deficiencias', icon: AlertTriangle, color: 'text-yellow-400' },
          { id: 'hidratacion', label: 'Summary', icon: Droplets, color: 'text-cyan-400' }
        ].map(tab => (
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
        
        {/* TAB: Vitales e Hidratación (Combined for quick access or separate) */}
        {activeTab === 'vitales' && (
          <div className="space-y-8 animate-in fade-in">
            <section>
              <h3 className="text-lg font-semibold text-red-400 mb-4 border-b border-white/10 pb-2 flex items-center">
                <Activity className="w-5 h-5 mr-2" /> SIGNOS VITALES Y ESTADO GENERAL
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 p-5 rounded-xl border border-white/5 space-y-4">
                  <label className="text-sm font-bold text-gray-300 block mb-2">Presión Arterial</label>
                  <div className="flex items-center bg-black/40 p-3 rounded-lg border border-white/5">
                    <input type="number" value={vitales.paSistolica} onChange={e => setVitales({...vitales, paSistolica: e.target.value})} className="w-20 bg-transparent text-2xl text-white font-bold text-center outline-none" placeholder="120" />
                    <span className="text-2xl text-gray-500 mx-2">/</span>
                    <input type="number" value={vitales.paDiastolica} onChange={e => setVitales({...vitales, paDiastolica: e.target.value})} className="w-20 bg-transparent text-2xl text-white font-bold text-center outline-none" placeholder="80" />
                    <span className="text-xs text-gray-400 ml-2">mmHg</span>
                  </div>
                  <div className={clsx(
                    "p-3 rounded-lg text-sm font-bold border text-center transition-all",
                    vitales.clasificacionPA === 'Normal' ? "bg-green-500/10 border-green-500/20 text-green-400" :
                    vitales.clasificacionPA === 'Elevada' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                  )}>
                    {vitales.clasificacionPA}
                  </div>
                </div>

                <div className="bg-black/20 p-5 rounded-xl border border-white/5 space-y-4">
                  <label className="text-sm font-bold text-gray-300 block mb-2">Estado de Alerta & Nutricional</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <span className="text-xs text-gray-400 uppercase">Estado de alerta:</span>
                        <div className="flex flex-wrap gap-2">
                          {['Alerta', 'Somnolienta', 'Confusa'].map(opt => (
                            <button key={opt} onClick={() => handleExamenChange('aspectoGeneral', 'alerta', opt)} className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border", examenFisico.aspectoGeneral.alerta === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10")}>{opt}</button>
                          ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs text-gray-400 uppercase">Estado nutricional aparente:</span>
                        <div className="flex gap-2">
                          {['Bueno', 'Regular', 'Malo'].map(opt => (
                            <button key={opt} onClick={() => handleExamenChange('aspectoGeneral', 'nutricional', opt)} className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border", examenFisico.aspectoGeneral.nutricional === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10")}>{opt}</button>
                          ))}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
                <h4 className="text-sm font-bold text-red-300 mb-4 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" /> SIGNOS DE ALARMA
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    'Edema de cara/manos', 'PA elevada', 'Hiperreflexia', 'Cefalea severa', 'Visión borrosa', 
                    'Dolor epigástrico', 'Sangrado vaginal', 'Disminución MF'
                  ].map(signo => (
                    <button
                      key={signo}
                      onClick={() => toggleAlarma(signo)}
                      className={clsx(
                        "flex items-center p-3 rounded-xl border transition-all text-left",
                        Array.isArray(resumen.signosAlarma) && resumen.signosAlarma.includes(signo) 
                          ? "bg-red-500/20 border-red-500/50 text-red-200" 
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      )}
                    >
                      <div className={clsx("w-3 h-3 rounded-full mr-3", Array.isArray(resumen.signosAlarma) && resumen.signosAlarma.includes(signo) ? "bg-red-400 animate-pulse" : "bg-white/10")} />
                      <span className="text-xs font-medium">{signo}</span>
                    </button>
                  ))}
                </div>
            </section>
          </div>
        )}

        {/* TAB: Examen Físico */}
        {activeTab === 'examen' && (
          <div className="space-y-8 animate-in fade-in max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-white/10 pb-2 flex items-center sticky top-0 bg-[#121212] z-10 py-2">
              <Stethoscope className="w-5 h-5 mr-2" /> 🩻 2. EXAMEN FÍSICO ORIENTADO
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              {/* PIEL Y FANERAS */}
              <div className="md:col-span-2 bg-black/20 p-5 rounded-2xl border border-white/5 space-y-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                  <Droplets className="w-4 h-4 mr-2" /> 🧴 PIEL Y FANERAS
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold block">⭐ COLORACIÓN</label>
                    <div className="flex flex-wrap gap-2">
                      {['Normal', 'Pálida', 'Ictérica', 'Cianótica'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('pielFaneras', 'coloracion', opt)} className={clsx("px-3 py-1.5 rounded-lg text-xs transition-all border", examenFisico.pielFaneras.coloracion === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/5")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold block">TURGOR</label>
                    <div className="flex gap-2">
                      {['Normal', 'Disminuido'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('pielFaneras', 'turgor', opt)} className={clsx("px-3 py-1.5 rounded-lg text-xs transition-all border", examenFisico.pielFaneras.turgor === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/5")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold block">HIDRATACIÓN</label>
                    <div className="flex flex-wrap gap-2">
                      {['Normal', 'Seca', 'Descamativa'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('pielFaneras', 'hidratacion', opt)} className={clsx("px-3 py-1.5 rounded-lg text-xs transition-all border", examenFisico.pielFaneras.hidratacion === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/5")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold block">LESIONES</label>
                    <div className="flex flex-wrap gap-2">
                      {['Ninguna', 'Estrías', 'Petequias', 'Equimosis'].map(opt => (
                        <button key={opt} onClick={() => toggleLesion(opt)} className={clsx("px-2 py-1.5 rounded-lg text-xs transition-all border", examenFisico.pielFaneras.lesiones.includes(opt) ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/5")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold block">EDEMA</label>
                    <div className="flex flex-wrap gap-2">
                      {['No', 'En tobillos', 'En manos', 'Generalizado'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('pielFaneras', 'edema', opt)} className={clsx("px-2 py-1.5 rounded-lg text-xs transition-all border", examenFisico.pielFaneras.edema === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/5")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold block">CABELLO</label>
                    <div className="flex flex-wrap gap-2">
                      {['Normal', 'Seco/quebradizo', 'Alopecia'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('pielFaneras', 'cabello', opt)} className={clsx("px-2 py-1.5 rounded-lg text-xs transition-all border", examenFisico.pielFaneras.cabello === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/5")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* OJOS */}
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">👁️ OJOS</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">⭐ CONJUNTIVAS:</span>
                    <div className="flex gap-1">
                      {['Normales', 'Pálidas', 'Ictéricas'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('ojos', 'conjuntivas', opt)} className={clsx("px-2 py-1 rounded text-[10px] border", examenFisico.ojos.conjuntivas === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">ESCLERÓTICA:</span>
                    <div className="flex gap-1">
                      {['Normal', 'Ictérica'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('ojos', 'esclerotica', opt)} className={clsx("px-2 py-1 rounded text-[10px] border", examenFisico.ojos.esclerotica === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <label className="flex items-center text-[10px] text-gray-400"><input type="checkbox" checked={examenFisico.ojos.xerosis} onChange={e => handleExamenChange('ojos', 'xerosis', e.target.checked)} className="mr-1 rounded" /> Xerosis conjuntival</label>
                    <label className="flex items-center text-[10px] text-gray-400"><input type="checkbox" checked={examenFisico.ojos.manchasBitot} onChange={e => handleExamenChange('ojos', 'manchasBitot', e.target.checked)} className="mr-1 rounded" /> Manchas de Bitot</label>
                  </div>
                </div>
              </div>

              {/* CAVIDAD ORAL */}
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">👄 CAVIDAD ORAL</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">⭐ LENGUA:</span>
                    <select value={examenFisico.cavidadOral.lengua} onChange={e => handleExamenChange('cavidadOral', 'lengua', e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white">
                        <option>Normal</option><option>Glositis</option><option>Pálida</option><option>Fisurada</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">LABIOS:</span>
                    <select value={examenFisico.cavidadOral.labios} onChange={e => handleExamenChange('cavidadOral', 'labios', e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white">
                        <option>Normales</option><option>Queilitis angular</option><option>Secos</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">ENCÍAS:</span>
                    <select value={examenFisico.cavidadOral.encias} onChange={e => handleExamenChange('cavidadOral', 'encias', e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white">
                        <option>Normales</option><option>Inflamadas</option><option>Sangrantes</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">DIENTES:</span>
                    <select value={examenFisico.cavidadOral.dientes} onChange={e => handleExamenChange('cavidadOral', 'dientes', e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white">
                        <option>Buenos</option><option>Caries</option><option>Prótesis</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* UÑAS */}
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">💅 UÑAS</h4>
                <div className="space-y-2">
                  <span className="text-xs text-gray-400">ASPECTO:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['Normales', 'Quebradizas', 'Coiloniquia', 'Estrías', 'Palidez'].map(opt => (
                      <button key={opt} onClick={() => handleExamenChange('unas', 'aspecto', opt)} className={clsx("px-2 py-1 rounded text-[10px] border", examenFisico.unas.aspecto === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400")}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* MÚSCULO-ESQUELÉTICO */}
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">💪 MÚSCULO-ESQUELÉTICO</h4>
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400">MASA MUSCULAR:</span>
                     <div className="flex gap-1">
                        {['Conservada', 'Disminuida', 'Emaciación'].map(opt => (
                           <button key={opt} onClick={() => handleExamenChange('musculoEsqueletico', 'masa', opt)} className={clsx("px-2 py-1 rounded text-[10px] border", examenFisico.musculoEsqueletico.masa === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400")}>{opt}</button>
                        ))}
                     </div>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400">DEFORMIDADES:</span>
                     <label className="flex items-center text-xs text-white"><input type="checkbox" checked={examenFisico.musculoEsqueletico.deformidades} onChange={e => handleExamenChange('musculoEsqueletico', 'deformidades', e.target.checked)} className="mr-2" /> Sí</label>
                   </div>
                   {examenFisico.musculoEsqueletico.deformidades && (
                     <input type="text" value={examenFisico.musculoEsqueletico.deformidadesDetalle} onChange={e => handleExamenChange('musculoEsqueletico', 'deformidadesDetalle', e.target.value)} placeholder="Especificar deformidad..." className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" />
                   )}
                </div>
              </div>

              {/* ABDOMEN */}
              <div className="md:col-span-2 bg-black/20 p-5 rounded-2xl border border-white/5 space-y-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">🤰 ABDOMEN</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">ALTURA UTERINA (cm)</label>
                    <input type="number" value={examenFisico.abdomen.alturaUterina} onChange={e => handleExamenChange('abdomen', 'alturaUterina', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">PERÍMETRO ABD (cm)</label>
                    <input type="number" value={examenFisico.abdomen.perimetro} onChange={e => handleExamenChange('abdomen', 'perimetro', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">FCF (lpm)</label>
                    <input type="number" value={examenFisico.abdomen.fcf} onChange={e => handleExamenChange('abdomen', 'fcf', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none" placeholder="0" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-8">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 font-bold block">MOVIMIENTOS FETALES:</span>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('abdomen', 'movimientos', opt)} className={clsx("px-4 py-1.5 rounded-lg text-xs border", examenFisico.abdomen.movimientos === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 font-bold block">DOLOR ABDOMINAL:</span>
                    <div className="flex gap-2">
                      {['No', 'Sí'].map(opt => (
                        <button key={opt} onClick={() => handleExamenChange('abdomen', 'dolor', opt)} className={clsx("px-4 py-1.5 rounded-lg text-xs border", examenFisico.abdomen.dolor === opt ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400")}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Deficiencias */}
        {activeTab === 'deficiencias' && (
          <div className="space-y-6 animate-in fade-in max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="sticky top-0 bg-[#121212] z-10 py-2 border-b border-white/10 mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-yellow-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" /> ⚠️ 3. SIGNOS DE DEFICIENCIAS NUTRICIONALES
              </h3>
              <div className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded">
                📊 ESCALA: 1=Leve | 2=Mod | 3=Sev
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Nutriente</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Signo Clínico</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-center">Presente</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-center">Severidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(Array.isArray(deficiencias) ? deficiencias : []).map((item, index) => (
                    <tr key={item?.id || index} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 align-top">
                        {(index === 0 || deficiencias[index-1]?.nutriente !== item?.nutriente) && (
                          <span className="text-xs font-black text-yellow-400/80">{item?.nutriente || 'Desconocido'}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-300 leading-relaxed font-light">{item?.signo}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button 
                            onClick={() => handleDeficienciaChange(item?.id, 'presente', true)}
                            className={clsx("w-8 h-8 rounded-lg text-[10px] font-bold border transition-all", item?.presente ? "bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/20" : "bg-black/20 border-white/10 text-gray-500")}
                          >Sí</button>
                          <button 
                            onClick={() => handleDeficienciaChange(item?.id, 'presente', false)}
                            className={clsx("w-8 h-8 rounded-lg text-[10px] font-bold border transition-all", !item?.presente ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/10 text-gray-500")}
                          >No</button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {[1, 2, 3].map(lvl => (
                            <button
                              key={lvl}
                              disabled={!item?.presente}
                              onClick={() => handleDeficienciaChange(item?.id, 'severidad', lvl)}
                              className={clsx(
                                "w-6 h-6 rounded text-[10px] font-bold border transition-all",
                                !item?.presente ? "opacity-20 cursor-not-allowed border-white/5 text-gray-600" :
                                item?.severidad === lvl ? "bg-yellow-500 border-yellow-400 text-black" : "bg-black/40 border-white/10 text-gray-500 hover:text-white"
                              )}
                            >{lvl}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Resumen */}
        {activeTab === 'hidratacion' && (
          <div className="space-y-6 animate-in fade-in">
             <h3 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-white/10 pb-2">Resumen y Hallazgos</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                      <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Ingesta de Hidratación</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500">VASOS AGUA/DÍA</span>
                          <input type="number" value={hidratacion.vasosAgua} onChange={e => setHidratacion({...hidratacion, vasosAgua: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Ej: 8" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500">ESTADO GLOBAL</span>
                          <select value={hidratacion.evaluacionGlobal} onChange={e => setHidratacion({...hidratacion, evaluacionGlobal: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-xs">
                             <option>Adecuada</option><option>Desp. Leve</option><option>Desp. Mod</option>
                          </select>
                        </div>
                      </div>
                   </div>
                   <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase">Observacion adicionales</label>
                      <textarea value={resumen.observaciones} onChange={e => setResumen({...resumen, observaciones: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white h-32 resize-none" placeholder="Notas libres..." />
                   </div>
                </div>
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col h-full">
                   <label className="text-xs font-bold text-cyan-300 uppercase mb-3">Integración de Hallazgos Clínicos</label>
                   <textarea value={resumen.hallazgos} onChange={e => setResumen({...resumen, hallazgos: e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white leading-relaxed resize-none" placeholder="Escriba aquí el análisis clínico integrado..." />
                </div>
             </div>
          </div>
        )}


      </div>
    </div>
  );
}
