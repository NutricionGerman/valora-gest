import React, { useState, useEffect } from 'react';
import { Save, ClipboardList, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function Diagnostico() {
  const [pes, setPes] = useState({
    problema: '',
    etiologia: '',
    signos: ''
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const patientId = localStorage.getItem('current_paciente_id');
    const saved = localStorage.getItem(`diagnostico_${patientId}`);
    if (saved) {
      setPes(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    const patientId = localStorage.getItem('current_paciente_id');
    localStorage.setItem(`diagnostico_${patientId}`, JSON.stringify(pes));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const generatedDiagnosis = `Paciente presenta ${pes.problema || '[Problema]'} relacionado con ${pes.etiologia || '[Etiología/Causa]'} evidenciado por ${pes.signos || '[Signos y Síntomas]'}.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDiagnosis);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ClipboardList className="w-6 h-6 mr-2 text-[var(--color-accent-teal)]" />
            Diagnóstico Nutricional PES
          </h2>
          <p className="text-gray-400 text-sm mt-1">Conclusión estructurada de la valoración nutricional del paciente.</p>
        </div>
        <button 
          onClick={handleSave} 
          className={clsx(
            "flex items-center px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg",
            isSaved 
              ? "bg-green-500 text-white shadow-green-500/20" 
              : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
          )}
        >
          {isSaved ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Guardado</> : <><Save className="w-5 h-5 mr-2" /> Guardar Diagnóstico</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario PES */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center">
              <span className="bg-red-500/20 text-red-400 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs">P</span>
              Problema
            </label>
            <p className="text-xs text-gray-500 mb-2">Alteración nutricional específica o riesgo.</p>
            <input 
              type="text" 
              value={pes.problema} 
              onChange={e => setPes({...pes, problema: e.target.value})} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors" 
              placeholder="Ej: Aumento de peso gestacional excesivo" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center">
              <span className="bg-yellow-500/20 text-yellow-400 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs">E</span>
              Etiología
            </label>
            <p className="text-xs text-gray-500 mb-2">Causa raíz o factor contribuyente.</p>
            <input 
              type="text" 
              value={pes.etiologia} 
              onChange={e => setPes({...pes, etiologia: e.target.value})} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors" 
              placeholder="Ej: Ingesta calórica excesiva por consumo frecuente de ultraprocesados" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center">
              <span className="bg-blue-500/20 text-blue-400 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs">S</span>
              Signos y Síntomas
            </label>
            <p className="text-xs text-gray-500 mb-2">Evidencia que respalda el problema (peso, labs, clínica).</p>
            <textarea 
              value={pes.signos} 
              onChange={e => setPes({...pes, signos: e.target.value})} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:border-blue-500/50 transition-colors" 
              placeholder="Ej: BMI de 28 kg/m2 (sobrepeso) y ganancia de peso semanal superior a las recomendaciones del IOM" 
            />
          </div>
        </div>

        {/* Vista Previa del Enunciado */}
        <div className="bg-gradient-to-br from-[var(--color-accent-teal)]/10 to-[var(--color-accent-green)]/5 border border-[var(--color-accent-teal)]/20 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
             <h3 className="text-lg font-bold text-white flex items-center">
               <AlertCircle className="w-5 h-5 mr-2 text-teal-400" />
               Redacción Final del Diagnóstico
             </h3>
             <button 
               onClick={copyToClipboard}
               className="text-gray-400 hover:text-white transition-colors bg-black/20 p-2 rounded-lg border border-white/5"
               title="Copiar texto"
             >
               {isCopied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
             </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 w-full relative group">
              <p className={clsx(
                "text-base md:text-lg leading-relaxed text-center font-medium",
                (!pes.problema && !pes.etiologia && !pes.signos) ? "text-gray-500 italic" : "text-gray-200"
              )}>
                {(!pes.problema && !pes.etiologia && !pes.signos) 
                  ? "Complete los cuadros de P, E y S para generar la oración automáticamente." 
                  : generatedDiagnosis}
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-black/20 p-4 rounded-xl text-xs text-gray-400 leading-relaxed border border-white/5">
            <strong>Recordatorio:</strong> Un buen diagnóstico PES debe ser claro, conciso y estar basado enteramente en los datos recolectados durante la Anamnesis, Valoración Clínica, Antropométrica y Dietética.
          </div>
        </div>
      </div>
    </div>
  );
}
