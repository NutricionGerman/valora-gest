import React, { useState, useEffect } from 'react';
import { Save, Clock, BarChart3, Heart, Target } from 'lucide-react';
import clsx from 'clsx';

export default function HistoriaAlimentaria() {
  const [activeTab, setActiveTab] = useState('recordatorio');

  // Nuevos estados para el método de 5 pasos
  const [r24hTipo, setR24hTipo] = useState('5pasos'); // '5pasos' o 'legacy'
  const [pasoR24H, setPasoR24H] = useState(1);
  const [r24hItems, setR24hItems] = useState([]);
  const [olvidados, setOlvidados] = useState({
    bebidas: false, snacks: false, dulces: false, suplementos: false, nocturnas: false, notas: ''
  });
  const [newItemText, setNewItemText] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Legacy Recordatorio State
  const [recordatorio, setRecordatorio] = useState({
    desayuno: { hora: '', lugar: '', descripcion: '' },
    mediaManana: { hora: '', lugar: '', descripcion: '' },
    almuerzo: { hora: '', lugar: '', descripcion: '' },
    mediaTarde: { hora: '', lugar: '', descripcion: '' },
    cena: { hora: '', lugar: '', descripcion: '' },
    extras: ''
  });

  const [frecuencia, setFrecuencia] = useState({});
  const foodGroups = ['Cereales', 'Tubérculos', 'Verduras', 'Frutas', 'Lácteos', 'Carnes (res)', 'Pollo', 'Pescado', 'Huevos', 'Leguminosas', 'Frutos secos', 'Aceites/grasas', 'Azúcares', 'Bebidas azucaradas', 'Agua simple'];

  const [preferencias, setPreferencias] = useState({
    gustan: '',
    noGustan: '',
    alergias: '',
    intolerancias: '',
    antojos: '',
    antojosFrecuencia: ''
  });

  const [raciones, setRaciones] = useState({});
  const racionGroups = [
    { name: 'Cereales', rec: '7-9 rac/día', eq: '1 pan, ½ taza' },
    { name: 'Verduras', rec: '3-4 rac/día', eq: '½ taza cocida' },
    { name: 'Frutas', rec: '3-4 rac/día', eq: '1 pieza med' },
    { name: 'Lácteos', rec: '3-4 rac/día', eq: '1 vaso leche' },
    { name: 'Carnes', rec: '2-3 rac/día', eq: '90g cocido' },
    { name: 'Leguminosas', rec: '1-2 rac/día', eq: '½ taza cocida' },
    { name: 'Grasas', rec: '4-6 rac/día', eq: '1 cdita aceite' },
    { name: 'Agua', rec: '8-10 vasos/d', eq: '1 vaso=250mL' }
  ];

  useEffect(() => {
    const patientId = localStorage.getItem('current_paciente_id');
    const saved = localStorage.getItem(`historia_alimentaria_${patientId}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.recordatorio5p) {
        setR24hTipo('5pasos');
        setR24hItems(data.recordatorio5p.items || []);
        setOlvidados(data.recordatorio5p.olvidados || {
          bebidas: false, snacks: false, dulces: false, suplementos: false, nocturnas: false, notas: ''
        });
      } else if (data.recordatorio && Object.keys(data.recordatorio).length > 0 && !data.recordatorio5p) {
        setR24hTipo('legacy');
        setRecordatorio(data.recordatorio);
      }
      
      if (data.frecuencia) setFrecuencia(data.frecuencia);
      if (data.preferencias) setPreferencias(data.preferencias);
      if (data.raciones) setRaciones(data.raciones);
    }
  }, []);

  const handleSave = () => {
    const patientId = localStorage.getItem('current_paciente_id');
    const dataToSave = {
      frecuencia, preferencias, raciones
    };
    
    // Save both to not lose data
    if (r24hTipo === '5pasos') {
      dataToSave.recordatorio5p = { items: r24hItems, olvidados };
      dataToSave.recordatorio = recordatorio; // Keep legacy if existed
    } else {
      dataToSave.recordatorio = recordatorio;
    }

    localStorage.setItem(`historia_alimentaria_${patientId}`, JSON.stringify(dataToSave));
    alert('Historia Alimentaria guardada exitosamente.');
  };

  const handleRecordatorioChange = (meal, field, value) => {
    setRecordatorio(prev => ({
      ...prev,
      [meal]: { ...prev[meal], [field]: value }
    }));
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Historia Alimentaria</h2>
        <button onClick={handleSave} className="flex items-center px-4 py-2 bg-[var(--color-accent-orange)] hover:bg-orange-500 text-white rounded-xl font-medium transition-colors">
          <Save className="w-4 h-4 mr-2" /> Guardar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
        {[
          { id: 'recordatorio', label: 'R24H', icon: Clock, color: 'text-blue-400' },
          { id: 'frecuencia', label: 'Frecuencia', icon: BarChart3, color: 'text-green-400' },
          { id: 'preferencias', label: 'Preferencias', icon: Heart, color: 'text-pink-400' },
          { id: 'raciones', label: 'Raciones', icon: Target, color: 'text-purple-400' }
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
        
        {/* TAB: Recordatorio 24h */}
        {activeTab === 'recordatorio' && r24hTipo === 'legacy' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-lg font-semibold text-blue-400">Recordatorio de 24 Horas (Formato Anterior)</h3>
              <button 
                onClick={() => { setR24hTipo('5pasos'); setPasoR24H(1); }}
                className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Actualizar a Método 5 Pasos
              </button>
            </div>
            <div className="space-y-4">
              {['desayuno', 'mediaManana', 'almuerzo', 'mediaTarde', 'cena'].map((meal, idx) => {
                const labels = ['Desayuno', 'Media Mañana', 'Almuerzo', 'Media Tarde', 'Cena'];
                return (
                  <div key={meal} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                    <h4 className="font-medium text-white">{labels[idx]}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="time" 
                        value={recordatorio[meal]?.hora || ''} 
                        onChange={(e) => handleRecordatorioChange(meal, 'hora', e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none [color-scheme:dark]"
                      />
                      <input 
                        type="text" 
                        placeholder="Lugar"
                        value={recordatorio[meal]?.lugar || ''} 
                        onChange={(e) => handleRecordatorioChange(meal, 'lugar', e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <textarea 
                      placeholder="¿Qué comió/bebió? Preparación y cantidades..."
                      value={recordatorio[meal]?.descripcion || ''} 
                      onChange={(e) => handleRecordatorioChange(meal, 'descripcion', e.target.value)}
                      rows="2"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                );
              })}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-medium text-white mb-2">Extras / Colaciones nocturnas</h4>
                <textarea 
                  value={recordatorio.extras} 
                  onChange={(e) => setRecordatorio({...recordatorio, extras: e.target.value})}
                  rows="2"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: Recordatorio 24h Método 5 Pasos */}
        {activeTab === 'recordatorio' && r24hTipo === '5pasos' && (
          <div className="space-y-6 animate-in fade-in flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-semibold text-blue-400">Recordatorio de 24 Horas: Método 5 Pasos</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(step => (
                  <button
                    key={step}
                    onClick={() => setPasoR24H(step)}
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      pasoR24H === step ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]" : 
                      pasoR24H > step ? "bg-blue-500/20 text-blue-300" : "bg-black/40 text-gray-500 border border-white/5"
                    )}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              {/* PASO 1: Listado Rápido */}
              {pasoR24H === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-1">Paso 1: Listado Rápido</h4>
                    <p className="text-sm text-blue-200/70">Enumere todos los alimentos y bebidas consumidos en orden cronológico, sin preocuparse por cantidades o detalles.</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Ej: Taza de café"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newItemText.trim()) {
                          setR24hItems([...r24hItems, { id: Date.now(), nombre: newItemText.trim(), hora: '', ocasion: '', lugar: '', cantidad: '', preparacion: '', detalles: '', olvidado: false }]);
                          setNewItemText('');
                        }
                      }}
                      className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                    />
                    <button 
                      onClick={() => {
                        if (newItemText.trim()) {
                          setR24hItems([...r24hItems, { id: Date.now(), nombre: newItemText.trim(), hora: '', ocasion: '', lugar: '', cantidad: '', preparacion: '', detalles: '', olvidado: false }]);
                          setNewItemText('');
                        }
                      }}
                      className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                    >
                      Añadir
                    </button>
                  </div>

                  <div className="space-y-2 mt-6">
                    {r24hItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-8 italic">No se han añadido alimentos aún.</p>
                    ) : (
                      r24hItems.map((item, index) => (
                        <div key={item.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5 group transition-all hover:border-blue-500/30">
                          {editingItemId === item.id ? (
                            <div className="flex-1 flex items-center space-x-2">
                              <input 
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setR24hItems(r24hItems.map(i => i.id === item.id ? { ...i, nombre: editingText } : i));
                                    setEditingItemId(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingItemId(null);
                                  }
                                }}
                                className="flex-1 bg-blue-500/10 border border-blue-500/50 rounded px-2 py-1 text-white text-sm outline-none"
                              />
                              <button 
                                onClick={() => {
                                  setR24hItems(r24hItems.map(i => i.id === item.id ? { ...i, nombre: editingText } : i));
                                  setEditingItemId(null);
                                }}
                                className="text-green-400 hover:text-green-300 text-xs font-bold px-2 py-1"
                              >
                                Guardar
                              </button>
                              <button 
                                onClick={() => setEditingItemId(null)}
                                className="text-gray-400 hover:text-gray-300 text-xs px-2 py-1"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-gray-200 flex-1">
                                <span className="text-blue-500/50 mr-2">{index + 1}.</span> 
                                {item.nombre}
                              </span>
                              <div className="flex items-center space-x-4">
                                <button 
                                  onClick={() => {
                                    setEditingItemId(item.id);
                                    setEditingText(item.nombre);
                                  }} 
                                  className="text-blue-400 hover:text-blue-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Editar
                                </button>
                                <button 
                                  onClick={() => setR24hItems(r24hItems.filter(i => i.id !== item.id))} 
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* PASO 2: Listado Olvidado */}
              {pasoR24H === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-1">Paso 2: Listado de Alimentos Olvidados</h4>
                    <p className="text-sm text-blue-200/70">Pregunte por alimentos que comúnmente se olvidan. ¿Consumió alguno de los siguientes?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {[
                      { id: 'bebidas', label: 'Bebidas (agua, café, té, jugos)' },
                      { id: 'snacks', label: 'Snacks y bocadillos' },
                      { id: 'dulces', label: 'Dulces, golosinas, postres' },
                      { id: 'suplementos', label: 'Suplementos / Medicamentos' },
                      { id: 'nocturnas', label: 'Comidas nocturnas (colaciones)' }
                    ].map(chk => (
                      <label key={chk.id} className="flex items-center space-x-3 bg-black/20 p-3 rounded-lg border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={olvidados[chk.id]}
                          onChange={(e) => setOlvidados({...olvidados, [chk.id]: e.target.checked})}
                          className="w-4 h-4 accent-blue-500"
                        />
                        <span className="text-gray-200">{chk.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                    <label className="text-sm text-gray-400">Si recordó algo, agréguelo a la lista principal:</label>
                    <div className="flex space-x-2">
                       <input 
                          type="text" 
                          placeholder="Ej: Galleta de agua, chicle..."
                          value={newItemText}
                          onChange={(e) => setNewItemText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newItemText.trim()) {
                              setR24hItems([...r24hItems, { id: Date.now(), nombre: newItemText.trim(), hora: '', ocasion: '', lugar: '', cantidad: '', preparacion: '', detalles: '', olvidado: true }]);
                              setNewItemText('');
                            }
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                        />
                        <button 
                          onClick={() => {
                            if (newItemText.trim()) {
                              setR24hItems([...r24hItems, { id: Date.now(), nombre: newItemText.trim(), hora: '', ocasion: '', lugar: '', cantidad: '', preparacion: '', detalles: '', olvidado: true }]);
                              setNewItemText('');
                            }
                          }}
                          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          Añadir Solv.
                        </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3: Tiempo y Ocasión */}
              {pasoR24H === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-1">Paso 3: Tiempo y Ocasión</h4>
                    <p className="text-sm text-blue-200/70">Registre la hora, el nombre de la ocasión y el lugar donde se consumió cada alimento.</p>
                  </div>

                  <div className="space-y-3 mt-4 overflow-y-auto max-h-[50vh] pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    {r24hItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">Agregue alimentos en los Pasos 1 y 2.</p>
                    ) : (
                      r24hItems.map((item) => (
                        <div key={item.id} className="bg-black/20 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-4">
                          <div className="md:w-1/3">
                            <span className="font-medium text-white block truncate">{item.nombre}</span>
                            {item.olvidado && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded uppercase">Recuperado</span>}
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <input 
                              type="time" 
                              value={item.hora}
                              onChange={(e) => setR24hItems(r24hItems.map(i => i.id === item.id ? {...i, hora: e.target.value} : i))}
                              className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none [color-scheme:dark]"
                            />
                            <select 
                              value={item.ocasion}
                              onChange={(e) => setR24hItems(r24hItems.map(i => i.id === item.id ? {...i, ocasion: e.target.value} : i))}
                              className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                            >
                              <option value="">Ocasión...</option>
                              <option value="Despertar">Al Despertar</option>
                              <option value="Desayuno">Desayuno</option>
                              <option value="Media Mañana">Media Mañana</option>
                              <option value="Almuerzo">Almuerzo</option>
                              <option value="Media Tarde">Media Tarde/Merienda</option>
                              <option value="Cena">Cena</option>
                              <option value="Colación Nocturna">Colación Nocturna</option>
                              <option value="Entre Comidas">Entre Comidas</option>
                            </select>
                            <input 
                              type="text" 
                              placeholder="Lugar"
                              value={item.lugar}
                              onChange={(e) => setR24hItems(r24hItems.map(i => i.id === item.id ? {...i, lugar: e.target.value} : i))}
                              className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* PASO 4: Ciclo de Detalle */}
              {pasoR24H === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-1">Paso 4: Ciclo de Detalle</h4>
                    <p className="text-sm text-blue-200/70">Profundice en la cantidad, método de preparación, marcas e ingredientes adicionales.</p>
                  </div>

                  <div className="space-y-3 mt-4 overflow-y-auto max-h-[50vh] pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    {r24hItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">Sin alimentos.</p>
                    ) : (
                      r24hItems.map((item) => (
                        <div key={item.id} className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                             <span className="font-bold text-teal-300">{item.nombre}</span>
                             <span className="text-xs text-gray-500">{item.ocasion || 'Sin ocasión'} | {item.hora || 'Sin hora'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input 
                              type="text" 
                              placeholder="Cantidad (ej: 1 taza, 150g)"
                              value={item.cantidad}
                              onChange={(e) => setR24hItems(r24hItems.map(i => i.id === item.id ? {...i, cantidad: e.target.value} : i))}
                              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                            />
                            <input 
                              type="text" 
                              placeholder="Preparación (ej: al horno, frito)"
                              value={item.preparacion}
                              onChange={(e) => setR24hItems(r24hItems.map(i => i.id === item.id ? {...i, preparacion: e.target.value} : i))}
                              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                            />
                            <input 
                              type="text" 
                              placeholder="Marcas / Extras"
                              value={item.detalles}
                              onChange={(e) => setR24hItems(r24hItems.map(i => i.id === item.id ? {...i, detalles: e.target.value} : i))}
                              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* PASO 5: Revisión Final */}
              {pasoR24H === 5 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-1">Paso 5: Revisión Final</h4>
                    <p className="text-sm text-blue-200/70">Revise la lista completa con el paciente para identificar posibles omisiones o aclarar inconsistencias.</p>
                  </div>

                  <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                          <tr className="bg-white/5 text-gray-300">
                            <th className="py-3 px-4">Hora/Ocasión</th>
                            <th className="py-3 px-4">Alimento</th>
                            <th className="py-3 px-4">Cantidad</th>
                            <th className="py-3 px-4">Preparación/Detalles</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {r24hItems.map(item => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 text-gray-400">
                                <span className="block font-medium text-white">{item.hora || '-'}</span>
                                <span className="text-xs">{item.ocasion || '-'}</span>
                              </td>
                              <td className="py-3 px-4 font-medium text-blue-200">{item.nombre}</td>
                              <td className="py-3 px-4 text-gray-300">{item.cantidad || '-'}</td>
                              <td className="py-3 px-4 text-gray-400">
                                <div>{item.preparacion || '-'}</div>
                                <div className="text-xs opacity-70">{item.detalles}</div>
                              </td>
                            </tr>
                          ))}
                          {r24hItems.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-6 text-gray-500">No hay registros para revisar.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controles del Wizard */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
              <button
                onClick={() => setPasoR24H(Math.max(1, pasoR24H - 1))}
                disabled={pasoR24H === 1}
                className="px-4 py-2 bg-black/40 text-gray-300 hover:text-white hover:bg-black/60 rounded-xl disabled:opacity-30 transition-colors"
              >
                Paso Anterior
              </button>
              
              {pasoR24H < 5 ? (
                <button
                  onClick={() => setPasoR24H(Math.min(5, pasoR24H + 1))}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-colors font-medium"
                >
                  Siguiente Paso
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-[0_0_15px_rgba(22,163,74,0.3)] transition-colors flex items-center font-medium"
                >
                  <Save className="w-4 h-4 mr-2" /> Confirmar Revisión y Guardar
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB: Frecuencia de Consumo */}
        {activeTab === 'frecuencia' && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-semibold text-green-400 mb-2 border-b border-white/10 pb-2">Frecuencia de Consumo</h3>
            <p className="text-xs text-gray-400 mb-4">D=Diario | 3-4S=3-4/sem | 1-2S=1-2/sem | M=Mensual | N=Nunca</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-gray-400">
                    <th className="py-2 px-3">Alimento</th>
                    <th className="py-2 px-1 text-center">D</th>
                    <th className="py-2 px-1 text-center">3-4S</th>
                    <th className="py-2 px-1 text-center">1-2S</th>
                    <th className="py-2 px-1 text-center">M</th>
                    <th className="py-2 px-1 text-center">N</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {foodGroups.map((food, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-3 text-white">{food}</td>
                      {['D', '3-4S', '1-2S', 'M', 'N'].map(freq => (
                        <td key={freq} className="py-3 px-1 text-center">
                          <input 
                            type="radio" 
                            name={`freq-${i}`}
                            checked={frecuencia[food] === freq}
                            onChange={() => setFrecuencia({...frecuencia, [food]: freq})}
                            className="w-4 h-4 accent-green-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Preferencias y Aversiones */}
        {activeTab === 'preferencias' && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-semibold text-pink-400 mb-4 border-b border-white/10 pb-2">Preferencias y Aversiones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">💚 Alimentos que le gustan</label>
                <textarea 
                  value={preferencias.gustan} onChange={(e) => setPreferencias({...preferencias, gustan: e.target.value})}
                  rows="3" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">💔 Alimentos que no le gustan</label>
                <textarea 
                  value={preferencias.noGustan} onChange={(e) => setPreferencias({...preferencias, noGustan: e.target.value})}
                  rows="3" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Alergias</label>
                <input 
                  type="text" value={preferencias.alergias} onChange={(e) => setPreferencias({...preferencias, alergias: e.target.value})} placeholder="Ninguna o especificar..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-pink-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Intolerancias</label>
                <input 
                  type="text" value={preferencias.intolerancias} onChange={(e) => setPreferencias({...preferencias, intolerancias: e.target.value})} placeholder="Ninguna o especificar..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-pink-500 outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2 bg-black/20 p-4 rounded-xl border border-white/5">
                <label className="text-sm font-medium text-pink-300 mb-2 block">🤤 Antojos del Embarazo</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" value={preferencias.antojos} onChange={(e) => setPreferencias({...preferencias, antojos: e.target.value})} placeholder="¿Qué alimentos?"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-pink-500 outline-none"
                  />
                  <select 
                    value={preferencias.antojosFrecuencia} onChange={(e) => setPreferencias({...preferencias, antojosFrecuencia: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none"
                  >
                    <option value="">Frecuencia que los satisface</option>
                    <option value="siempre">Siempre</option>
                    <option value="a_veces">A veces</option>
                    <option value="rara_vez">Rara vez</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Raciones consumidas */}
        {activeTab === 'raciones' && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-semibold text-purple-400 mb-4 border-b border-white/10 pb-2">Porciones y Raciones (Consumo vs Rec)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-gray-400">
                    <th className="py-2 px-3">Grupo</th>
                    <th className="py-2 px-3">Consume (rac/d)</th>
                    <th className="py-2 px-3">Recomendado</th>
                    <th className="py-2 px-3">Equivalente</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {racionGroups.map((group, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 px-3 text-white font-medium">{group.name}</td>
                      <td className="py-3 px-3">
                        <input 
                          type="number" step="0.5" min="0"
                          value={raciones[group.name] || ''}
                          onChange={(e) => setRaciones({...raciones, [group.name]: e.target.value})}
                          className="w-20 bg-black/30 border border-white/10 rounded px-2 py-1 text-center text-white focus:border-purple-500 outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-purple-300">{group.rec}</td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{group.eq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
