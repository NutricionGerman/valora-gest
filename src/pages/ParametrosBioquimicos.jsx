import React, { useState, useEffect } from 'react';
import { Save, TestTube, Activity, Stethoscope, Dna } from 'lucide-react';
import clsx from 'clsx';

export default function ParametrosBioquimicos() {
  const [activeTab, setActiveTab] = useState('hematologicos');

  const [laboratorios, setLaboratorios] = useState({
    hematologicos: {
      hemoglobina: '',
      hematocrito: '',
      ferritina: '',
      vcm: '',
      hcm: '',
      fecha: ''
    },
    metabolicos: {
      glucosa: '',
      ptog: '',
      colesterolTotal: '',
      trigliceridos: '',
      hdl: '',
      ldl: '',
      fecha: ''
    },
    funcionales: {
      tsh: '',
      t4l: '',
      tgo: '',
      tgp: '',
      creatinina: '',
      acidoUrico: '',
      fecha: ''
    },
    micronutrientes: {
      vitaminaD: '',
      vitaminaB12: '',
      acidoFolico: '',
      calcioIonico: '',
      fecha: ''
    }
  });

  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    const patientId = localStorage.getItem('current_paciente_id');
    const saved = localStorage.getItem(`parametros_bioquimicos_${patientId}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.laboratorios) setLaboratorios(data.laboratorios);
      if (data.observaciones) setObservaciones(data.observaciones);
    }
  }, []);

  const handleSave = () => {
    const patientId = localStorage.getItem('current_paciente_id');
    localStorage.setItem(`parametros_bioquimicos_${patientId}`, JSON.stringify({
      laboratorios, observaciones
    }));
    alert('Parámetros Bioquímicos guardados exitosamente.');
  };

  const handleChange = (categoria, campo, valor) => {
    setLaboratorios(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [campo]: valor
      }
    }));
  };

  const parametrosDef = {
    hematologicos: [
      { id: 'hemoglobina', label: 'Hemoglobina', unit: 'g/dL', min: 11.0, max: 14.0 },
      { id: 'hematocrito', label: 'Hematocrito', unit: '%', min: 33, max: 42 },
      { id: 'ferritina', label: 'Ferritina', unit: 'ng/mL', min: 15, max: 150 },
      { id: 'vcm', label: 'VCM', unit: 'fL', min: 80, max: 100 },
      { id: 'hcm', label: 'HCM', unit: 'pg', min: 27, max: 33 }
    ],
    metabolicos: [
      { id: 'glucosa', label: 'Glucosa en Ayunas', unit: 'mg/dL', min: 70, max: 92 },
      { id: 'ptog', label: 'PTOG', unit: 'mg/dL', min: 70, max: 140 },
      { id: 'colesterolTotal', label: 'Colesterol Total', unit: 'mg/dL', min: 150, max: 300 },
      { id: 'trigliceridos', label: 'Triglicéridos', unit: 'mg/dL', min: 50, max: 250 },
      { id: 'hdl', label: 'HDL', unit: 'mg/dL', min: 40, max: 80 },
      { id: 'ldl', label: 'LDL', unit: 'mg/dL', min: 50, max: 150 }
    ],
    funcionales: [
      { id: 'tsh', label: 'TSH', unit: 'mUI/L', min: 0.2, max: 3.0 },
      { id: 't4l', label: 'T4 Libre', unit: 'ng/dL', min: 0.7, max: 1.8 },
      { id: 'tgo', label: 'TGO (AST)', unit: 'U/L', min: 5, max: 40 },
      { id: 'tgp', label: 'TGP (ALT)', unit: 'U/L', min: 5, max: 40 },
      { id: 'creatinina', label: 'Creatinina', unit: 'mg/dL', min: 0.4, max: 0.8 },
      { id: 'acidoUrico', label: 'Ácido Úrico', unit: 'mg/dL', min: 2.0, max: 5.5 }
    ],
    micronutrientes: [
      { id: 'vitaminaD', label: 'Vitamina D (25-OH)', unit: 'ng/mL', min: 30, max: 100 },
      { id: 'vitaminaB12', label: 'Vitamina B12', unit: 'pg/mL', min: 200, max: 900 },
      { id: 'acidoFolico', label: 'Ácido Fólico', unit: 'ng/mL', min: 4.0, max: 20.0 },
      { id: 'calcioIonico', label: 'Calcio Iónico', unit: 'mg/dL', min: 4.5, max: 5.3 }
    ]
  };



  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Parámetros Bioquímicos</h2>
        <button onClick={handleSave} className="flex items-center px-4 py-2 bg-[var(--color-accent-orange)] hover:bg-orange-500 text-white rounded-xl font-medium transition-colors">
          <Save className="w-4 h-4 mr-2" /> Guardar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
        {[
          { id: 'hematologicos', label: 'Hematológicos', icon: DropletIcon, color: 'text-red-400' },
          { id: 'metabolicos', label: 'Metabólicos', icon: Activity, color: 'text-yellow-400' },
          { id: 'funcionales', label: 'Funcionales', icon: Stethoscope, color: 'text-blue-400' },
          { id: 'micronutrientes', label: 'Micronutrientes', icon: Dna, color: 'text-green-400' }
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

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[50vh]">
        
        {/* Helper Date & Tab Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-white/10 gap-4">
          <h3 className={clsx(
            "text-lg font-semibold",
            activeTab === 'hematologicos' && "text-red-400",
            activeTab === 'metabolicos' && "text-yellow-400",
            activeTab === 'funcionales' && "text-blue-400",
            activeTab === 'micronutrientes' && "text-green-400"
          )}>
            Estudios {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <div className="flex items-center space-x-3 bg-black/20 px-4 py-2 rounded-lg border border-white/5">
            <label className="text-sm text-gray-400">Fecha de Laboratorio:</label>
            <input 
              type="date" 
              value={laboratorios[activeTab].fecha}
              onChange={e => handleChange(activeTab, 'fecha', e.target.value)}
              className="bg-transparent text-sm text-white outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        {/* TAB Content (Table) */}
        <div className="overflow-x-auto animate-in fade-in">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold rounded-tl-lg">Parámetro</th>
                <th className="py-3 px-4 font-semibold text-center">Resultado</th>
                <th className="py-3 px-4 font-semibold text-center">Unidad</th>
                <th className="py-3 px-4 font-semibold text-center">Referencia</th>
                <th className="py-3 px-4 font-semibold text-center rounded-tr-lg">Nivel UI</th>
              </tr>
            </thead>
            <tbody>
              {parametrosDef[activeTab].map(item => (
                <TableRow 
                  key={item.id} 
                  item={item} 
                  value={laboratorios[activeTab][item.id] || ''}
                  onChange={(val) => handleChange(activeTab, item.id, val)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Observaciones Globales */}
        <div className="mt-8 animate-in fade-in">
          <label className="text-sm font-semibold text-gray-300 block mb-2">Interpretación y Observaciones Bioquímicas</label>
          <textarea 
            value={observaciones} onChange={e => setObservaciones(e.target.value)}
            rows="4" placeholder="Ej: Anemia ferropénica leve según niveles de hemoglobina y ferritina..."
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>

      </div>
    </div>
  );
}

function DropletIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
    </svg>
  );
}

const MiniGraphic = ({ value, min, max }) => {
  const val = parseFloat(value);
  if (isNaN(val)) {
    return (
      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden flex">
        <div className="bg-red-500/50 w-1/4 h-full" />
        <div className="bg-green-500/50 w-1/2 h-full" />
        <div className="bg-red-500/50 w-1/4 h-full" />
      </div>
    );
  }
  
  // Scale definition:
  // We want the 'green' min-max to be the middle 50% of the bar.
  // The total width is 2 * (max - min).
  const range = max - min;
  const lowerBound = min - (range / 2);
  const upperBound = max + (range / 2);
  
  // Position of the tick (0 to 100%)
  let pos = ((val - lowerBound) / (upperBound - lowerBound)) * 100;
  pos = Math.max(0, Math.min(100, pos)); // Clamp to 0-100

  return (
    <div className="relative w-24 flex items-center h-4">
      <div className="w-full h-1.5 rounded-full overflow-hidden flex">
        <div className="bg-red-500 w-1/4 h-full" />
        <div className="bg-green-500 w-1/2 h-full" />
        <div className="bg-red-500 w-1/4 h-full" />
      </div>
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm z-10" 
        style={{ left: `${pos}%`, height: '100%' }}
      />
    </div>
  );
};

const TableRow = ({ item, value, onChange }) => (
  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
    <td className="py-3 px-4 text-sm font-medium text-gray-200">{item.label}</td>
    <td className="py-3 px-4">
      <input 
        type="number" step="0.01"
        placeholder="---"
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-sm text-center text-white focus:outline-none focus:border-indigo-500"
      />
    </td>
    <td className="py-3 px-4 text-sm text-gray-400 text-center">{item.unit}</td>
    <td className="py-3 px-4 text-sm text-gray-400 text-center">{item.min} - {item.max}</td>
    <td className="py-3 px-4 flex items-center justify-center">
      <MiniGraphic value={value} min={item.min} max={item.max} />
    </td>
  </tr>
);
