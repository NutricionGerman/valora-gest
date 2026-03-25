import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Save, RefreshCw, Plus, Trash2, Edit } from 'lucide-react';
import clsx from 'clsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const weeks = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42];
const zn2_data = [17.72, 17.72, 17.73, 17.76, 17.8, 17.86, 17.93, 18.02, 18.11, 18.22, 18.34, 18.47, 18.61, 18.75, 18.9, 19.06, 19.48, 19.63, 19.8, 19.95, 20.12, 20.25, 20.39, 20.52, 20.66, 20.8, 20.95, 21.11, 21.25, 21.38, 21.49, 21.59, 21.67, 21.74, 22.12, 22.19, 22.27];
const zn1_data = [19.67, 19.68, 19.7, 19.73, 19.79, 19.86, 19.94, 20.05, 20.16, 20.29, 20.42, 20.58, 20.74, 20.9, 21.08, 21.26, 21.61, 21.79, 21.97, 22.15, 22.34, 22.49, 22.64, 22.79, 22.95, 23.11, 23.28, 23.46, 23.62, 23.77, 23.89, 24.01, 24.1, 24.18, 24.46, 24.54, 24.63];
const z0_data = [22.43, 22.45, 22.48, 22.52, 22.59, 22.67, 22.77, 22.9, 23.03, 23.18, 23.33, 23.51, 23.7, 23.89, 24.09, 24.3, 24.51, 24.71, 24.92, 25.13, 25.34, 25.52, 25.69, 25.86, 26.04, 26.23, 26.42, 26.62, 26.81, 26.98, 27.12, 27.25, 27.36, 27.45, 27.54, 27.64, 27.74];
const z1_data = [26.79, 26.8, 26.83, 26.86, 26.94, 27.02, 27.13, 27.28, 27.43, 27.59, 27.77, 27.97, 28.19, 28.41, 28.64, 28.88, 28.75, 28.98, 29.22, 29.46, 29.7, 29.91, 30.11, 30.3, 30.51, 30.73, 30.95, 31.18, 31.4, 31.59, 31.75, 31.9, 32.03, 32.13, 31.83, 31.94, 32.05];
const z2_data = [35.26, 35.2, 35.1, 35.07, 35.08, 35.12, 35.18, 35.3, 35.41, 35.55, 35.74, 35.93, 36.14, 36.39, 36.61, 36.89, 35.75, 36.01, 36.28, 36.53, 36.8, 37.03, 37.28, 37.49, 37.72, 37.96, 38.24, 38.49, 38.74, 38.95, 39.12, 39.31, 39.43, 39.53, 38.31, 38.43, 38.54];

export default function Antropometria() {
  const [step, setStep] = useState(1);
  const [heightCm, setHeightCm] = useState('');
  const [preWeightKg, setPreWeightKg] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [week, setWeek] = useState('');
  
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Load from local storage on mount (optional, helps persistence in SPA)
  useEffect(() => {
    const patientId = localStorage.getItem('current_paciente_id');
    const saved = localStorage.getItem(`antropometria_${patientId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.height) setHeightCm(parsed.height);
      if (parsed.preWeight) setPreWeightKg(parsed.preWeight);
      if (parsed.history) setHistory(parsed.history);
      if (parsed.height && parsed.preWeight) setStep(2);
    }
  }, []);



  const handleNextStep = () => {
    setError('');
    const h = parseFloat(heightCm);
    const w = parseFloat(preWeightKg);

    if (isNaN(h) || h <= 100 || h >= 250) {
      setError('Ingresa una altura válida (cm).');
      return;
    }
    if (isNaN(w) || w <= 20 || w >= 300) {
      setError('Ingresa un peso pregestacional válido (kg).');
      return;
    }
    setStep(2);
  };

  const clearData = () => {
    if (window.confirm('¿Seguro que deseas limpiar todos los datos?')) {
      setHeightCm('');
      setPreWeightKg('');
      setWeightKg('');
      setWeek('');
      setHistory([]);
      setStep(1);
      setError('');
    }
  };

  const handleSave = () => {
    const patientId = localStorage.getItem('current_paciente_id');
    localStorage.setItem(`antropometria_${patientId}`, JSON.stringify({
      height: heightCm,
      preWeight: preWeightKg,
      history
    }));
    alert('Datos antropométricos guardados exitosamente.');
  };

  const getCategoryInfo = (bmi, type = 'standard', gestationalWeek = null) => {
    let text = '';
    let cssClass = '';
    if (type === 'gestational' && gestationalWeek !== null) {
      const weekIndex = weeks.indexOf(gestationalWeek);
      if (weekIndex !== -1) {
        const zn2 = zn2_data[weekIndex];
        const zn1 = zn1_data[weekIndex];
        const z0 = z0_data[weekIndex];
        const z1 = z1_data[weekIndex];
        const z2 = z2_data[weekIndex];
        
        if (bmi < zn2) { text = 'Bajo Peso Severo (<-2SD)'; cssClass = 'text-white bg-red-600'; }
        else if (bmi < zn1) { text = 'Bajo Peso (-2 a -1 SD)'; cssClass = 'text-white bg-orange-500'; }
        else if (bmi < z1) { text = 'Peso Normal (-1 a +1 SD)'; cssClass = 'text-white bg-[var(--color-accent-teal)]'; }
        else if (bmi < z2) { text = 'Sobrepeso (+1 a +2 SD)'; cssClass = 'text-white bg-[var(--color-accent-yellow)]'; }
        else { text = 'Obesidad (> +2 SD)'; cssClass = 'text-white bg-[var(--color-accent-orange)]'; }
      } else {
        text = '(Ref. no exacta)';
        cssClass = 'text-gray-400 bg-gray-800';
      }
    } else {
      if (bmi < 18.5) { text = 'Bajo Peso'; cssClass = 'text-white bg-gray-500'; }
      else if (bmi < 25) { text = 'Peso Normal'; cssClass = 'text-white bg-[var(--color-accent-teal)]'; }
      else if (bmi < 30) { text = 'Sobrepeso'; cssClass = 'text-white bg-[var(--color-accent-yellow)]'; }
      else { text = 'Obesidad'; cssClass = 'text-white bg-[var(--color-accent-orange)]'; }
    }
    return { text, cssClass };
  };

  const handleAddPoint = () => {
    setError('');
    const w = parseFloat(weightKg);
    const gestWeek = parseInt(week, 10);
    const hM = parseFloat(heightCm) / 100;

    if (isNaN(w) || w <= 20 || w >= 300) {
      setError('Ingresa un peso actual válido.');
      return;
    }
    if (isNaN(gestWeek) || gestWeek < weeks[0] || !weeks.includes(gestWeek)) {
      setError(`La semana debe ser entre ${weeks[0]} y ${weeks[weeks.length - 1]}.`);
      return;
    }

    const bmi = parseFloat(w / (hM * hM)).toFixed(2);
    const newHistory = [...history];
    const existingIndex = newHistory.findIndex(p => p.week === gestWeek);
    
    if (existingIndex > -1) {
      newHistory[existingIndex] = { ...newHistory[existingIndex], weight: w, bmi: parseFloat(bmi) };
    } else {
      newHistory.push({ week: gestWeek, weight: w, bmi: parseFloat(bmi) });
    }
    
    newHistory.sort((a, b) => a.week - b.week);
    setHistory(newHistory);
    setWeightKg('');
    setWeek('');
  };

  const handleRemovePoint = (weekToRemove) => {
    const newHistory = history.filter(p => p.week !== weekToRemove);
    setHistory(newHistory);
  };

  const handleEditPointFromTable = (point) => {
    setWeek(point.week.toString());
    setWeightKg(point.weight ? point.weight.toString() : '');
  };

  const chartData = useMemo(() => {
    const userTrajectoryPoints = new Array(weeks.length).fill(null);
    history.forEach(point => {
      const index = weeks.indexOf(point.week);
      if (index !== -1) {
        userTrajectoryPoints[index] = point.bmi;
      }
    });

    return {
      labels: weeks,
      datasets: [
        {
          label: '-2 SD (Extremo)',
          data: zn2_data,
          borderColor: 'rgba(239, 68, 68, 0.4)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1.5,
          order: 5
        },
        {
          label: '-1 SD (Riesgo Bajo)',
          data: zn1_data,
          borderColor: 'rgba(234, 179, 8, 0.5)',
          backgroundColor: 'rgba(34, 197, 94, 0.03)',
          fill: '+1',
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 2,
          order: 4
        },
        {
          label: 'Mediana (Ideal)',
          data: z0_data,
          borderColor: 'rgba(34, 197, 94, 0.6)',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 3,
          order: 3
        },
        {
          label: '+1 SD (Riesgo Alto)',
          data: z1_data,
          borderColor: 'rgba(234, 179, 8, 0.5)',
          backgroundColor: 'rgba(34, 197, 94, 0.03)',
          fill: '-1',
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 2,
          order: 2
        },
        {
          label: '+2 SD (Extremo)',
          data: z2_data,
          borderColor: 'rgba(239, 68, 68, 0.4)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1.5,
          order: 1
        },
        {
          label: 'Mi Trayectoria IMC',
          data: userTrajectoryPoints,
          borderColor: '#2dd4bf',
          backgroundColor: '#2dd4bf',
          showLine: true,
          borderWidth: 4,
          spanGaps: true,
          pointStyle: 'circle',
          pointRadius: 7,
          pointHoverRadius: 9,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.1,
          order: 0
        }
      ]
    };
  }, [history]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#fff',
    scales: {
      x: { title: { display: true, text: 'Semana de Gestación', color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { title: { display: true, text: 'IMC (kg/m²)', color: '#ccc' }, min: 15, max: 45, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } }
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#fff' } },
      title: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  const preGestationalBmi = (step === 2 && heightCm && preWeightKg) 
    ? (parseFloat(preWeightKg) / Math.pow(parseFloat(heightCm) / 100, 2))
    : null;

  const preCatInfo = preGestationalBmi ? getCategoryInfo(preGestationalBmi, 'standard') : null;
  const lastPoint = history.length > 0 ? history[history.length - 1] : null;
  const lastCatInfo = lastPoint ? getCategoryInfo(lastPoint.bmi, 'gestational', lastPoint.week) : null;

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Valoración Antropométrica</h2>
        <div className="flex items-center space-x-2">
          <button onClick={clearData} className="p-2 text-gray-400 hover:text-white transition-colors" title="Limpiar Historial">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button onClick={handleSave} className="flex items-center px-4 py-2 bg-[var(--color-accent-blue)] hover:bg-blue-600 text-white rounded-xl font-medium transition-colors bg-blue-500">
            <Save className="w-4 h-4 mr-2" /> Guardar
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Step Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={clsx("flex flex-col items-center", step === 1 ? "opacity-100" : "opacity-60")}>
          <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors", step >= 1 ? "bg-[var(--color-accent-teal)] text-white" : "bg-white/10 text-gray-400")}>1</div>
          <span className="text-xs mt-2 text-gray-400 font-medium">Datos Base</span>
        </div>
        <div className="w-16 h-px bg-white/20"></div>
        <div className={clsx("flex flex-col items-center", step === 2 ? "opacity-100" : "opacity-60")}>
          <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors", step === 2 ? "bg-[var(--color-accent-teal)] text-white" : "bg-white/10 text-gray-400")}>2</div>
          <span className="text-xs mt-2 text-gray-400 font-medium">Gráfica</span>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[var(--color-accent-orange)] mb-4 flex items-center">
            <span className="w-2 h-6 bg-[var(--color-accent-orange)] rounded-full mr-3"></span>
            Datos Base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Altura (cm)</label>
              <input 
                type="number" 
                value={heightCm} 
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="Ej: 165"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-teal)] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Peso Pregestacional (kg)</label>
              <input 
                type="number" 
                step="0.1"
                value={preWeightKg} 
                onChange={(e) => setPreWeightKg(e.target.value)}
                placeholder="Ej: 65.0"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-teal)] transition-colors"
              />
            </div>
          </div>
          <button 
            onClick={handleNextStep}
            className="mt-6 w-full md:w-auto px-6 py-3 bg-[var(--color-accent-orange)] hover:bg-orange-500 text-white rounded-xl font-medium transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Diagnostic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <span className="text-sm text-gray-400 font-medium mb-1">Valoración Pregestacional</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">IMC {preGestationalBmi?.toFixed(2)}</span>
                <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", preCatInfo?.cssClass)}>
                  {preCatInfo?.text}
                </span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <span className="text-sm text-gray-400 font-medium mb-1">Último IMC Gestacional {lastPoint ? `(Sem. ${lastPoint.week})` : ''}</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{lastPoint ? lastPoint.bmi.toFixed(2) : '--'}</span>
                {lastCatInfo && (
                  <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", lastCatInfo?.cssClass)}>
                    {lastCatInfo?.text}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-[var(--color-accent-teal)] mb-4 flex items-center">
              <span className="w-2 h-6 bg-[var(--color-accent-teal)] rounded-full mr-3"></span>
              Registrar Punto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Peso Actual (kg)</label>
                <input 
                  type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-teal)] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Semana Gestación</label>
                <input 
                  type="number" step="1" value={week} onChange={(e) => setWeek(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-teal)] transition-colors"
                />
              </div>
              <button 
                onClick={handleAddPoint}
                className="w-full py-3 bg-[var(--color-accent-teal)] hover:bg-[#3d7a7b] text-white rounded-xl font-medium transition-colors flex justify-center items-center"
              >
                <Plus className="w-5 h-5 mr-2" /> Agregar a Gráfica
              </button>
            </div>
          </div>

          <div id="chartContainer" className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 h-[400px] md:h-[500px]">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* History List/Editor */}
          {history.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-6 bg-[var(--color-accent-teal)] rounded-full mr-3"></span>
                Historial de Registros
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs text-gray-300 uppercase bg-white/5">
                    <tr>
                      <th className="px-4 py-3">Semana</th>
                      <th className="px-4 py-3">Peso (kg)</th>
                      <th className="px-4 py-3">IMC</th>
                      <th className="px-4 py-3">Clasificación</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map((point) => {
                      const { text, cssClass } = getCategoryInfo(point.bmi, 'gestational', point.week);
                      return (
                        <tr key={point.week} className="hover:bg-white/5 transition-colors group">
                          <td className="px-4 py-4 font-medium text-white">Semana {point.week}</td>
                          <td className="px-4 py-4">{point.weight || '--'} kg</td>
                          <td className="px-4 py-4">{point.bmi}</td>
                          <td className="px-4 py-4">
                            <span className={clsx("px-2 py-0.5 rounded-full text-[10px]", cssClass)}>
                              {text}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEditPointFromTable(point)}
                              className="p-1 hover:text-[var(--color-accent-teal)] transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRemovePoint(point.week)}
                              className="p-1 hover:text-red-400 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-gray-400">
            <p><strong className="text-[var(--color-accent-teal)]">Interpretación Clínica (Calvo et al., 2009):</strong> Los puntos de corte óptimos para predecir riesgos en el peso al nacer son las desviaciones estándar <strong>-1 SD</strong> (Riesgo de bajo peso) y <strong>+1 SD</strong> (Riesgo de macrosomía). El rango entre estas líneas se considera la zona de seguimiento normal para un crecimiento fetal saludable.</p>
          </div>
          
          <div className="flex justify-end pt-2 pb-8 md:pb-0">
             <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white underline underline-offset-4 mr-auto my-auto">
               Volver a Datos Base
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
