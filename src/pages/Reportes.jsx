import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Reportes() {
  const [data, setData] = useState({
    filiacion: null,
    antropometria: null,
    clinica: null,
    bioquimica: null,
    alimentaria: null
  });

  const [isGenerating, setIsGenerating] = useState(false);
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

      setData({
        filiacion: filiacionStr ? JSON.parse(filiacionStr) : null,
        antropometria: antropometriaStr ? JSON.parse(antropometriaStr) : null,
        clinica: clinicaStr ? JSON.parse(clinicaStr) : null,
        bioquimica: bioquimicaStr ? JSON.parse(bioquimicaStr) : null,
        alimentaria: alimentariaStr ? JSON.parse(alimentariaStr) : null
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
      // Temporarily show the element to ensure all content is measured correctly
      element.style.display = 'block';
      element.style.position = 'static';
      element.style.visibility = 'visible';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      // Restore element styles
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Handle multi-page if height exceeds A4
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

  const renderTable = (headers, rows, title) => (
    <div style={{ marginBottom: '24px' }}>
      {title && <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '8px', textTransform: 'uppercase' }}>{title}</h4>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', border: '1px solid #e5e7eb' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb' }}>
            {headers.map((h, i) => <th key={i} style={{ padding: '8px', border: '1px solid #e5e7eb', textAlign: 'left' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j} style={{ padding: '8px', border: '1px solid #e5e7eb' }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white">Reportes y Exportación</h2>
          <p className="text-gray-400">Consolidación de datos para la generación del PDF.</p>
        </div>
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
                       key === 'alimentaria' ? 'H. Alimentaria' : key}
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
               <p className="text-center text-gray-400 relative z-10">El PDF incluirá todos los módulos marcados como "Completados".<br/>Haga clic en <strong>Exportar PDF</strong> para descargarlo.</p>
            </div>
          </div>

          {/* HIDDEN REPORT CONTAINER */}
          <div 
            ref={reportRef} 
            className="absolute top-0 left-[-5000px] pointer-events-none -z-50 p-10"
            style={{ 
              width: '210mm', 
              backgroundColor: '#ffffff', 
              color: '#000000',
              fontFamily: 'Arial, sans-serif'
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
                <p style={{ margin: 0 }}><strong>Protocolo:</strong> Control Prenatal Nutricional</p>
              </div>
            </div>

            {/* 1. DATOS DE IDENTIFICACIÓN */}
            {data.filiacion && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                  📋 1. DATOS DE IDENTIFICACIÓN
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <p style={{ gridColumn: 'span 2' }}><strong>Nombre completo:</strong> <span style={{ borderBottom: '1px solid #e5e7eb', paddingRight: '20px' }}>{data.filiacion.nombre}</span></p>
                  <p><strong>Edad actual:</strong> {data.filiacion.edad} años 
                    {(parseInt(data.filiacion.edad) < 20 || parseInt(data.filiacion.edad) > 35) && (
                      <span style={{ marginLeft: '8px', color: '#b91c1c', fontWeight: 'bold' }}>(⚠️ Riesgo)</span>
                    )}
                  </p>
                  <p><strong>DNI/N° ID:</strong> {data.filiacion.dni || '---'}</p>
                  <p><strong>Teléfono:</strong> {data.filiacion.telefono || '---'}</p>
                  <p><strong>Nivel educativo:</strong> {data.filiacion.nivelEducativo || '---'}</p>
                  <p><strong>Ocupación:</strong> {data.filiacion.ocupacion || '---'}</p>
                  <p style={{ gridColumn: 'span 2' }}><strong>Domicilio:</strong> {data.filiacion.domicilio || '---'}</p>
                  <p><strong>Vive con:</strong> {data.filiacion.viveCon || '---'}</p>
                  <p><strong>Apoyo familiar:</strong> {data.filiacion.redApoyo}</p>
                </div>
              </div>
            )}

            {/* 2. ANTECEDENTES PERSONALES Y FAMILIARES */}
            {data.filiacion && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                  🩺 2. ANTECEDENTES PERSONALES Y FAMILIARES
                </h3>
                <div style={{ fontSize: '13px' }}>
                  <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', border: '1px solid #e5e7eb', marginBottom: '16px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '11px', color: '#374151' }}>ANTECEDENTES PERSONALES:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <p>{data.filiacion.enfDiabetes ? '☑' : '☐'} Diabetes</p>
                      <p>{data.filiacion.enfHipertension ? '☑' : '☐'} Hipertensión</p>
                      <p>{data.filiacion.enfHipotiroidismo ? '☑' : '☐'} Hipotiroidismo</p>
                      <p>{data.filiacion.enfRenal ? '☑' : '☐'} Enf. Renal</p>
                      <p>{data.filiacion.enfCardiopatia ? '☑' : '☐'} Cardiopatía</p>
                      <p>Otros: {data.filiacion.enfEspecifique || 'No'}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <p><strong>¿Anemia/Micronutrientes?:</strong> {data.filiacion.anemia ? 'Sí' : 'No'}</p>
                      <p><strong>Cirugías Previas:</strong> {data.filiacion.cirugiasPrevias ? 'Sí' : 'No'}</p>
                      <p><strong>TCA:</strong> {data.filiacion.tca ? 'Sí' : 'No'}</p>
                      <p><strong>Alergias:</strong> {data.filiacion.alergiasAlimentarias ? data.filiacion.alergiasCuales : 'No'}</p>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', marginBottom: '8px', fontSize: '11px', color: '#374151' }}>ANTECEDENTES FAMILIARES:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px' }}>
                      <p>{data.filiacion.famDM2 ? '☑' : '☐'} DM2 {data.filiacion.famDM2Parent && `(${data.filiacion.famDM2Parent})`}</p>
                      <p>{data.filiacion.famHTA ? '☑' : '☐'} HTA {data.filiacion.famHTAParent && `(${data.filiacion.famHTAParent})`}</p>
                      <p>{data.filiacion.famObesidad ? '☑' : '☐'} Obesidad {data.filiacion.famObesidadParent && `(${data.filiacion.famObesidadParent})`}</p>
                      <p>{data.filiacion.famPreeclampsia ? '☑' : '☐'} Preeclampsia {data.filiacion.famPreeclampsiaParent && `(${data.filiacion.famPreeclampsiaParent})`}</p>
                      <p>{data.filiacion.famPrematuridad ? '☑' : '☐'} Prematuridad {data.filiacion.famPrematuridadParent && `(${data.filiacion.famPrematuridadParent})`}</p>
                      <p>{data.filiacion.famDTN ? '☑' : '☐'} Defectos Tubo Neural {data.filiacion.famDTNParent && `(${data.filiacion.famDTNParent})`}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ANTECEDENTES GINECO-OBSTÉTRICOS */}
            {data.filiacion && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                  🤰 3. ANTECEDENTES GINECO-OBSTÉTRICOS
                </h3>
                <div style={{ fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#f0fdfa', padding: '8px', borderRadius: '4px', fontWeight: 'bold', color: '#0f766e', border: '1px solid #ccfbf1', marginBottom: '16px' }}>
                    <span>Gestas: {data.filiacion.gestas || 0}</span>
                    <span>Partos: {data.filiacion.paras || 0}</span>
                    <span>Cesáreas: {data.filiacion.cesareas || 0}</span>
                    <span>Abortos: {data.filiacion.abortos || 0}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <p><strong>FUM:</strong> {data.filiacion.fum || '---'}</p>
                    <p><strong>EG:</strong> {data.filiacion.semanasGestacion || '---'} semanas</p>
                    <p><strong>FPP:</strong> {data.filiacion.fppEco || '---'}</p>
                    <p><strong>Semanas:</strong> {data.filiacion.semanasGestacion || '---'} sem</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ESTILO DE VIDA */}
            {data.filiacion && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                  🏃 4. ESTILO DE VIDA
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '13px' }}>
                  <p><strong>Actividad Física:</strong> {data.filiacion.actFisicaRealiza ? `${data.filiacion.actFisicaTipo || ''} (${data.filiacion.actFisicaFrec || 0} v/sem)` : 'Sedentaria'}</p>
                  <p><strong>Sustancias:</strong> Tabaco: {data.filiacion.consTabaco ? 'Sí' : 'No'} | Alcohol: {data.filiacion.consAlcohol ? 'Sí' : 'No'}</p>
                  <p><strong>Descanso:</strong> {data.filiacion.suenoHoras || 0}h {data.filiacion.suenoInsomnio ? '(Con insomnio)' : ''}</p>
                  <p><strong>Estrés:</strong> {data.filiacion.estres || 'Normal'}</p>
                  <p style={{ gridColumn: 'span 2' }}><strong>Seguridad Alimentaria:</strong> {data.filiacion.seguridadAlimentaria || '---'}</p>
                </div>
              </div>
            )}

            <div style={{ pageBreakBefore: 'always' }} />

            {/* II. VALORACIÓN ANTROPOMÉTRICA */}
            {data.antropometria && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                  📏 II. VALORACIÓN ANTROPOMÉTRICA
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                   {[
                     { l: 'Talla', v: data.antropometria.height, u: 'cm' },
                     { l: 'Peso Preg.', v: data.antropometria.preWeight, u: 'kg' },
                     { l: 'Peso Actual', v: data.antropometria.currentWeight, u: 'kg' },
                     { l: 'IMC Preg.', v: (parseFloat(data.antropometria.preWeight) / Math.pow(parseFloat(data.antropometria.height)/100, 2)).toFixed(1), u: '' }
                   ].map((item, i) => (
                     <div key={i} style={{ textAlign: 'center', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                       <p style={{ fontSize: '9px', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>{item.l}</p>
                       <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>{item.v} <small style={{ fontSize: '10px' }}>{item.u}</small></p>
                     </div>
                   ))}
                </div>
                <div style={{ fontSize: '12px', padding: '12px', background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '4px' }}>
                   <p><strong>Ganancia de Peso Estimada:</strong> {data.antropometria?.weightGain || '---'} kg</p>
                   <p><strong>Meta de Ganancia Recomendada:</strong> {data.antropometria?.gainTarget || '---'}</p>
                </div>
              </div>
            )}

            {/* III. VALORACIÓN CLÍNICA */}
            {data.clinica && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                  🩺 III. VALORACIÓN CLÍNICA
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '12px', marginBottom: '16px' }}>
                  <p><strong>PA:</strong> {data.clinica.vitales?.paSistolica}/{data.clinica.vitales?.paDiastolica} mmHg ({data.clinica.vitales?.clasificacionPA})</p>
                  <p><strong>Hidratación:</strong> {data.clinica.hidratacion?.vasosAgua} vasos/día ({data.clinica.hidratacion?.evaluacionGlobal})</p>
                </div>

                {renderTable(
                  ['NUTRIENTE', 'SIGNO CLÍNICO', 'PRESENTE', 'SEV'],
                  (Array.isArray(data.clinica.deficiencias) ? data.clinica.deficiencias : []).map(d => [d?.nutriente || '-', d?.signo || '-', d?.presente ? 'SÍ' : 'NO', d?.severidad || '-']),
                  '⚠️ SIGNOS DE DEFICIENCIAS NUTRICIONALES'
                )}

                <div style={{ fontSize: '11px', background: '#f8fafc', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                   <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>RESUMEN EXAMEN FÍSICO:</p>
                   <p><strong>Cabello:</strong> {data.clinica.examenFisico?.pielFaneras?.cabello} | <strong>Piel:</strong> {data.clinica.examenFisico?.pielFaneras?.coloracion}</p>
                   <p><strong>Lengua:</strong> {data.clinica.examenFisico?.cavidadOral?.lengua} | <strong>Encías:</strong> {data.clinica.examenFisico?.cavidadOral?.encias}</p>
                   <p><strong>Uñas:</strong> {data.clinica.examenFisico?.unas?.aspecto} | <strong>Edema:</strong> {data.clinica.examenFisico?.pielFaneras?.edema}</p>
                   <p><strong>Altura Uterina:</strong> {data.clinica.examenFisico?.abdomen?.alturaUterina} cm | <strong>Mov. Fetales:</strong> {data.clinica.examenFisico?.abdomen?.movimientos}</p>
                </div>
                
                {data.clinica.resumen?.hallazgos && (
                  <div style={{ marginTop: '12px', fontSize: '12px', padding: '12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '4px' }}>
                    <p><strong>Análisis Integrado:</strong> {data.clinica.resumen?.hallazgos}</p>
                  </div>
                )}
              </div>
            )}

            {/* IV. HISTORIA ALIMENTARIA COMPLETA */}
            {data.alimentaria && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdfa' }}>
                  🍎 IV. HISTORIA ALIMENTARIA
                </h3>
                
                {/* R24H TABLE */}
                {data.alimentaria.recordatorio5p ? (
                  <>
                    {renderTable(
                      ['HORA / OCASIÓN', 'ALIMENTO', 'CANTIDAD', 'PREPARACIÓN Y DETALLES', 'LUGAR'],
                      (Array.isArray(data.alimentaria.recordatorio5p?.items) ? data.alimentaria.recordatorio5p.items : []).map(item => [
                        `${item?.hora || '---'} \n(${item?.ocasion || '---'})`,
                        item?.nombre || '---',
                        item?.cantidad || '---',
                        `${item?.preparacion || ''} ${item?.detalles ? `(${item.detalles})` : ''}`,
                        item?.lugar || '---'
                      ]),
                      '📋 RECORDATORIO DE 24 HORAS (MÉTODO 5 PASOS)'
                    )}
                  </>
                ) : (
                  <>
                    {renderTable(
                      ['TIEMPO', 'HORA', 'LUGAR', 'DESCRIPCIÓN DE ALIMENTOS Y PREPARACIÓN'],
                      Object.entries(data.alimentaria.recordatorio || {}).filter(([k]) => k !== 'extras').map(([k, v]) => [
                        k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1'),
                        v?.hora || '---',
                        v?.lugar || '---',
                        v?.descripcion || '---'
                      ]),
                      '📋 RECORDATORIO DE 24 HORAS (R24H)'
                    )}
                    {data.alimentaria.recordatorio?.extras && <p style={{ fontSize: '10px', marginTop: '-15px', marginBottom: '20px' }}><strong>Extras:</strong> {data.alimentaria.recordatorio?.extras}</p>}
                  </>
                )}

                {/* FRECUENCIA TABLE */}
                {renderTable(
                  ['GRUPO DE ALIMENTO', 'FRECUENCIA'],
                  Object.entries(data.alimentaria.frecuencia || {}).map(([k, v]) => [k, v]),
                  '📊 FRECUENCIA DE CONSUMO'
                )}

                {/* RACIONES TABLE */}
                {renderTable(
                  ['GRUPO', 'CONSUME (RAC)', 'RECOMENDADO'],
                  Object.entries(data.alimentaria.raciones || {}).map(([k, v]) => {
                    const rec = {
                      'Cereales': '7-9', 'Verduras': '3-4', 'Frutas': '3-4', 'Lácteos': '3-4',
                      'Carnes': '2-3', 'Leguminosas': '1-2', 'Grasas': '4-6', 'Agua': '8-10'
                    };
                    return [k, v, rec[k] || '---'];
                  }),
                  '⚖️ CUMPLIMIENTO DE RACIONES'
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px', marginTop: '10px' }}>
                  <div style={{ padding: '8px', background: '#fdf2f8', border: '1px solid #fce7f3', borderRadius: '4px' }}>
                    <p><strong>Gustos:</strong> {data.alimentaria.preferencias?.gustan || '---'}</p>
                    <p><strong>Rechazos:</strong> {data.alimentaria.preferencias?.noGustan || '---'}</p>
                  </div>
                  <div style={{ padding: '8px', background: '#fdf2f8', border: '1px solid #fce7f3', borderRadius: '4px' }}>
                    <p><strong>Alergias:</strong> {data.alimentaria.preferencias?.alergias || '---'}</p>
                    <p><strong>Intolerancias:</strong> {data.alimentaria.preferencias?.intolerancias || '---'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* FIRMA */}
            <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', width: '250px' }}>
                <div style={{ borderTop: '1px solid #000', marginBottom: '8px' }}></div>
                <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Firma y Sello del Profesional</p>
                <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Licenciatura en Nutrición</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
