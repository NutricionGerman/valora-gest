import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, X, Activity } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { infoClinica } from '../data/infoClinica';

export default function Reportes() {
  const [data, setData] = useState({
    filiacion: null,
    antropometria: null,
    clinica: null,
    bioquimica: null,
    alimentaria: null,
    diagnostico: null
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    try {
      const patientId = localStorage.getItem('current_paciente_id');
      if (!patientId) return;

      const filiacionStr = localStorage.getItem(`anamnesis_${patientId}`) || localStorage.getItem(`filiacion_clinica_${patientId}`);
      const antropometriaStr = localStorage.getItem(`antropometria_${patientId}`);
      const clinicaStr = localStorage.getItem(`valoracion_clinica_${patientId}`);
      const bioquimicaStr = localStorage.getItem(`parametros_bioquimicos_${patientId}`);
      const alimentariaStr = localStorage.getItem(`historia_alimentaria_${patientId}`);
      const diagnosticoStr = localStorage.getItem(`diagnostico_${patientId}`);

      setData({
        filiacion: filiacionStr ? JSON.parse(filiacionStr) : null,
        antropometria: antropometriaStr ? JSON.parse(antropometriaStr) : null,
        clinica: clinicaStr ? JSON.parse(clinicaStr) : null,
        bioquimica: bioquimicaStr ? JSON.parse(bioquimicaStr) : null,
        alimentaria: alimentariaStr ? JSON.parse(alimentariaStr) : null,
        diagnostico: diagnosticoStr ? JSON.parse(diagnosticoStr) : null
      });
    } catch (e) {
      console.error("Error loading report data:", e);
    }
  }, []);

  const generatePDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Reporte_ValoraGest_${data.filiacion?.nombre || 'Paciente'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Hubo un error al generar el PDF: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasData = Object.values(data).some(v => v !== null);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white">Reportes y Exportación</h2>
          <p className="text-gray-400">Consolidación de datos para la generación del PDF.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={generatePDF} 
            disabled={!hasData || isGenerating}
            className="flex items-center px-4 py-2 bg-[var(--color-accent-teal)] hover:bg-teal-500 disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors"
          >
            {isGenerating ? (
              <span className="flex items-center"><span className="animate-spin mr-2">⏳</span> Generando...</span>
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Exportar PDF</>
            )}
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center relative z-10">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay datos suficientes</h3>
          <p className="text-gray-400">Complete al menos un módulo clínico para poder generar un reporte.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Estado de la Valoración</h3>
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200 capitalize">
                      {key === 'filiacion' ? 'Filiación Clínica' : 
                       key === 'clinica' ? 'Valoración Clínica' : 
                       key === 'antropometria' ? 'Antropometría' : 
                       key === 'bioquimica' ? 'P. Bioquímicos' : 
                       key === 'alimentaria' ? 'H. Alimentaria' : 
                       key === 'diagnostico' ? 'Diagnóstico PES' : key}
                    </span>
                  </div>
                  {value ? (
                    <span className="flex items-center text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded"><CheckCircle className="w-4 h-4 mr-1" /> Completado</span>
                  ) : (
                    <span className="text-sm text-gray-500 bg-black/40 px-2 py-1 rounded">Pendiente</span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5" />
               <FileText className="w-16 h-16 text-gray-500 mb-4 opacity-50" />
               <p className="text-center text-gray-400 relative z-10">
                 Haga clic en los nutrientes de la vista previa para ver información relevante.<br/>
                 El PDF se generará con todos los datos completados.
               </p>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto pb-10">
            <h3 className="text-lg font-semibold text-white mb-4">Vista Previa Interactiva del Informe</h3>
            <div 
              ref={reportRef} 
              className="mx-auto rounded-lg shadow-2xl"
              style={{ 
                width: '210mm', 
                backgroundColor: '#ffffff', 
                color: '#000000',
                fontFamily: 'Arial, sans-serif',
                minHeight: '297mm',
                padding: '20mm'
              }}
            >
              {/* ENCABEZADO */}
              <div style={{ borderBottom: '3px solid #0d9488', paddingBottom: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h1 style={{ fontSize: '36px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em', color: '#0f766e', margin: 0 }}>ValoraGest</h1>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', color: '#4b5563', margin: 0 }}>Reporte de Valoración Nutricional Gestacional</h2>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                  <p style={{ margin: 0 }}><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* FILIACIÓN */}
              {data.filiacion && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                    📋 I. DATOS DE IDENTIFICACIÓN
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <p><strong>Nombre:</strong> {data.filiacion.nombre}</p>
                    <p><strong>Edad:</strong> {data.filiacion.edad} años</p>
                    <p><strong>EG:</strong> {data.filiacion.semanasGestacion} semanas</p>
                    <p><strong>Ocupación:</strong> {data.filiacion.ocupacion}</p>
                  </div>
                </div>
              )}

              {/* ANTROPOMETRÍA */}
              {data.antropometria && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                    📏 II. ANTROPOMETRÍA
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[
                      { l: 'Talla', v: data.antropometria.height, u: 'cm' },
                      { l: 'Peso Preg.', v: data.antropometria.preWeight, u: 'kg' },
                      { l: 'Peso Actual', v: data.antropometria.currentWeight, u: 'kg' },
                      { l: 'IMC Preg.', v: (parseFloat(data.antropometria.preWeight) / Math.pow(parseFloat(data.antropometria.height)/100, 2)).toFixed(1), u: '' }
                    ].map((item, i) => (
                      <div key={i} style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                        <p style={{ fontSize: '8px', color: '#6b7280', margin: 0 }}>{item.l}</p>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '4px 0' }}>{item.v} <small style={{ fontSize: '8px' }}>{item.u}</small></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ALIMENTARIA */}
              {data.alimentaria && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                    🍎 III. ANÁLISIS NUTRICIONAL (R24H)
                  </h3>
                  {(() => {
                    const items = (data.alimentaria.comidas || []).flatMap(c => c.alimentos || []);
                    if (items.length === 0) return <p style={{ fontSize: '11px' }}>No hay datos de consumo.</p>;

                    const sum = (field) => items.reduce((acc, i) => acc + (Number(i[field]) || 0), 0);
                    const rda = { kcal: 2200, proteinas: 71, hco: 175, lipidos: 28, vit_a: 770, b9: 600, vit_c: 105, calcio: 950, hierro: 16 };

                    const card = (key, label, val, unit, target) => {
                      const info = infoClinica[key];
                      const pct = target ? Math.min(Math.round((val / target) * 100), 100) : 0;
                      const color = (val / target) * 100 > 110 ? '#ef4444' : (val / target) * 100 >= 90 ? '#22c55e' : (val / target) * 100 >= 50 ? '#f59e0b' : '#3b82f6';
                      
                      return (
                        <div 
                          key={key}
                          onClick={() => info && setSelectedNutrient(info)}
                          style={{ padding: '8px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: info ? 'pointer' : 'default', transition: 'all 0.2s' }}
                          onMouseOver={(e) => info && (e.currentTarget.style.backgroundColor = '#f0f9ff')}
                          onMouseOut={(e) => info && (e.currentTarget.style.backgroundColor = '#f9fafb')}
                        >
                          <div style={{ fontSize: '8px', color: '#6b7280', display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{label}</span>
                            {info && <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>ⓘ</span>}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{val.toFixed(1)} <span style={{ fontSize: '9px', fontWeight: 'normal' }}>{unit}</span></div>
                          {target && (
                            <div style={{ marginTop: '4px', height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: color }} />
                            </div>
                          )}
                        </div>
                      );
                    };

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                        {card('kcal', 'Energía', sum('kcal'), 'kcal', rda.kcal)}
                        {card('proteinas', 'Proteínas', sum('proteinas'), 'g', rda.proteinas)}
                        {card('b9', 'Ác. Fólico', sum('b9'), 'µg', rda.b9)}
                        {card('calcio', 'Calcio', sum('calcio'), 'mg', rda.calcio)}
                        {card('hierro', 'Hierro', sum('hierro'), 'mg', rda.hierro)}
                      </div>
                    );
                  })()}
                </div>
              )}

              {data.diagnostico && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                    🎯 IV. DIAGNÓSTICO NUTRICIONAL
                  </h3>
                  <div style={{ padding: '12px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '6px', fontSize: '13px', fontStyle: 'italic', color: '#0369a1' }}>
                    "Paciente presenta {data.diagnostico.problema} relacionado con {data.diagnostico.etiologia} evidenciado por {data.diagnostico.signos || 'valoración clínica'}."
                  </div>
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '100px', textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #000', width: '250px', margin: '0 auto 8px' }}></div>
                <p style={{ fontSize: '11px', fontWeight: 'bold', margin: 0 }}>Firma y Sello del Profesional</p>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedNutrient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1a1c1e] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setSelectedNutrient(null)}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white z-10"
            >
              <X size={20} />
            </button>
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 pt-10 border-b border-white/5">
              <div className="flex items-center gap-4 mb-2">
                <span className="p-3 bg-blue-500/20 rounded-2xl text-blue-400"><Activity size={32} /></span>
                <div>
                  <h3 className="text-3xl font-bold text-white tracking-tight">{selectedNutrient.nombre}</h3>
                  <p className="text-blue-400 font-medium tracking-wide">Guía de Deficiencias Nutricionales</p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <section>
                <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Manifestación Principal
                </h4>
                <p className="text-xl text-gray-100 font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                  {selectedNutrient.resumen}
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Fuentes Alimentarias</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNutrient.fuentes?.split(', ').map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm font-medium">{f}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Riesgo en Embarazo</h4>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                    <p className="text-sm text-amber-200 leading-relaxed">{selectedNutrient.riesgo}</p>
                  </div>
                </div>
              </section>
            </div>
            <div className="p-6 border-t border-white/5 bg-black/40 text-center">
              <p className="text-[10px] text-gray-500 italic">
                Esta información es orientativa y para fines de apoyo clínico.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
