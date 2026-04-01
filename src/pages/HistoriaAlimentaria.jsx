import React, { useState, useEffect } from 'react';
import { Save, Clock, Heart, Calculator, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { alimentos as alimentosData } from '../data/alimentos';
import { calcularRequerimientosPaciente } from '../data/requerimientos';

export default function HistoriaAlimentaria() {
  const [activeTab, setActiveTab] = useState('recordatorio');

  // Estado unificado de comidas para RM24H
  const [comidas, setComidas] = useState([
    { id: Date.now().toString(), nombre: 'Comida 1', descripcionTexto: '', alimentos: [] }
  ]);

  // Buscador de alimentos activo por cada comida particular
  const [activeSearchComidaId, setActiveSearchComidaId] = useState(null);
  const [foodSearchText, setFoodSearchText] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodCantidad, setFoodCantidad] = useState('');
  const [foodGrams, setFoodGrams] = useState(100);

  const [preferencias, setPreferencias] = useState({
    gustan: '',
    noGustan: '',
    alergias: '',
    intolerancias: '',
    antojos: '',
    antojosFrecuencia: ''
  });

  const [requerimientos, setRequerimientos] = useState(null);
  
  // Array derivado de alimentos para la tabla total
  const calculoNutricional = comidas.reduce((acc, comida) => [...acc, ...comida.alimentos], []);


  useEffect(() => {
    const patientId = localStorage.getItem('current_paciente_id');
    const saved = localStorage.getItem(`historia_alimentaria_${patientId}`);
    
    // Carga de Demografía para cálculo RDA
    const anamnesis = JSON.parse(localStorage.getItem(`anamnesis_${patientId}`) || '{}');
    const antro = JSON.parse(localStorage.getItem(`antropometria_${patientId}`) || '{}');
    const pesoUsar = antro.pesoActual || antro.peso || 60; // default 60 si no hay peso
    const rda = calcularRequerimientosPaciente(anamnesis.edad, pesoUsar, anamnesis.semanasGestacion);
    setRequerimientos(rda);

    if (saved) {
      const data = JSON.parse(saved);
      if (data.comidas && data.comidas.length > 0) {
        setComidas(data.comidas);
      }
      
      if (data.preferencias) setPreferencias(data.preferencias);
    }

  }, []);

  const handleSave = () => {
    const patientId = localStorage.getItem('current_paciente_id');
    const dataToSave = {
      preferencias,
      comidas
    };

    localStorage.setItem(`historia_alimentaria_${patientId}`, JSON.stringify(dataToSave));
    alert('Historia Alimentaria guardada exitosamente.');
  };

  const handleComidaChange = (comidaId, field, value) => {
    setComidas(prev => prev.map(c => c.id === comidaId ? { ...c, [field]: value } : c));
  };

  const deleteAlimentoFromComida = (comidaId, alimentoId) => {
    setComidas(prev => prev.map(c => {
      if (c.id === comidaId) {
        return { ...c, alimentos: c.alimentos.filter(a => a.id !== alimentoId) };
      }
      return c;
    }));
  };

  const addAlimentoToComida = (comidaId) => {
    if (selectedFood && foodGrams > 0) {
      const ratio = foodGrams / 100;
      const kcal = (selectedFood.hco * 4) + (selectedFood.proteinas * 4) + (selectedFood.lipidos * 9);
      
      const newAlimento = {
        id: Date.now().toString(),
        comidaId,
        nombre: selectedFood.nombre,
        cantidad_casera: foodCantidad || 'No especificada',
        gramos: foodGrams,
        kcal: kcal * ratio,
        hco: selectedFood.hco * ratio,
        proteinas: selectedFood.proteinas * ratio,
        lipidos: selectedFood.lipidos * ratio,
        fibra: selectedFood.fibra * ratio,
        vit_c: selectedFood.vit_c * ratio,
        hierro: selectedFood.hierro * ratio,
        calcio: selectedFood.calcio * ratio,
        sodio: selectedFood.sodio * ratio
      };

      setComidas(prev => prev.map(c => {
        if (c.id === comidaId) {
          return { ...c, alimentos: [...c.alimentos, newAlimento] };
        }
        return c;
      }));
      setFoodSearchText('');
      setSelectedFood(null);
      setFoodCantidad('');
      setFoodGrams(100);
      setActiveSearchComidaId(null);
    }
  };

  const renderProgressBar = (current, target, unit = '') => {
    if (!target) return null;
    let percentage = (current / target) * 100;
    const isOverTarget = percentage > 100;
    const displayPercentage = Math.min(percentage, 100);
    const percentStr = displayPercentage.toFixed(1) + '%';
    
    // Choose color based on percentage
    let barColor = 'bg-blue-500';
    if (percentage > 110) barColor = 'bg-red-500';
    else if (percentage >= 90) barColor = 'bg-green-500';
    else if (percentage >= 50) barColor = 'bg-amber-500';

    return (
      <div className="mt-1 w-full flex flex-col items-center justify-center">
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-1">
          <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: percentStr }}></div>
        </div>
        <div className="text-[10px] text-gray-400 whitespace-nowrap">
          {percentage.toFixed(1)}% de {target.toFixed(0)}{unit}
        </div>
      </div>
    );
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
          { id: 'preferencias', label: 'Preferencias', icon: Heart, color: 'text-pink-400' },
          { id: 'calculo', label: 'Cálculo R24H', icon: Calculator, color: 'text-amber-400' }
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
        
        {/* TAB: Recordatorio 24h & Nutrición Unificados */}
        {activeTab === 'recordatorio' && (
          <div className="space-y-6 animate-in fade-in flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-semibold text-blue-400">Registro de Comidas de 24 hs</h3>
              <button
                onClick={() => setComidas([...comidas, { id: Date.now().toString(), nombre: `Comida ${comidas.length + 1}`, descripcionTexto: '', alimentos: [] }])}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-colors font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Agregar Comida
              </button>
            </div>

            <div className="flex-1 space-y-8">
              {comidas.map((comida, idx) => (
                <div key={comida.id} className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4 shadow-sm relative">
                  {/* Eliminar Comida Botón */}
                  <button 
                    onClick={() => {
                        if (confirm('¿Eliminar esta comida completa?')) {
                            setComidas(comidas.filter(c => c.id !== comida.id));
                        }
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                    title="Eliminar Comida"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center w-full max-w-[80%]">
                    <input 
                      type="text" 
                      value={comida.nombre} 
                      onChange={(e) => handleComidaChange(comida.id, 'nombre', e.target.value)}
                      className="bg-transparent text-xl font-bold text-white border-b border-transparent hover:border-white/20 focus:border-blue-500 focus:outline-none transition-colors mr-3"
                    />
                  </div>
                  
                  {/* Descripción Textarea */}
                  <div className="relative">
                    <textarea 
                      placeholder="Redacte aquí todo lo consumido de forma general (ej: cafe con leche, tostadas con queso etc etc...)"
                      value={comida.descripcionTexto} 
                      onChange={(e) => handleComidaChange(comida.id, 'descripcionTexto', e.target.value)}
                      rows="2"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 hover:border-white/20 outline-none resize-none transition-colors"
                    />
                  </div>

                  {/* Tabla de Alimentos */}
                  <div className="bg-black/30 rounded-xl overflow-visible border border-white/5">
                    <div className="w-full overflow-visible">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                          <tr className="bg-white/5 text-gray-400 border-b border-white/10">
                            <th className="py-3 px-4 font-medium">Alimento</th>
                            <th className="py-3 px-4 font-medium w-48">Cantidad</th>
                            <th className="py-3 px-4 font-medium w-32">Gramos</th>
                            <th className="py-3 px-4 font-medium w-16 text-center"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {comida.alimentos.map(item => (
                            <tr key={item.id} className="hover:bg-white/5 text-gray-300">
                              <td className="py-2.5 px-4 font-medium text-amber-200">{item.nombre}</td>
                              <td className="py-2.5 px-4 text-gray-300">{item.cantidad_casera}</td>
                              <td className="py-2.5 px-4 font-mono text-gray-300">{item.gramos} g</td>
                              <td className="py-2.5 px-4 text-center">
                                <button 
                                  onClick={() => deleteAlimentoFromComida(comida.id, item.id)}
                                  className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 mx-auto" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          
                          {/* Fila para agregar alimento nuevo */}
                          <tr className="bg-blue-500/5">
                            <td className="p-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={activeSearchComidaId === comida.id ? foodSearchText : ''}
                                  onChange={(e) => {
                                    setActiveSearchComidaId(comida.id);
                                    setFoodSearchText(e.target.value);
                                    setSelectedFood(null);
                                  }}
                                  placeholder="Buscar alimento en BD..."
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-sm"
                                  onFocus={() => setActiveSearchComidaId(comida.id)}
                                />
                                {foodSearchText && activeSearchComidaId === comida.id && !selectedFood && (
                                  <div className="absolute top-full mt-1 left-0 z-50 bg-gray-800 border border-white/20 rounded-lg shadow-2xl max-h-60 overflow-y-auto w-[calc(100vw-3rem)] md:w-96">
                                    {alimentosData
                                      .filter(f => f.nombre.toLowerCase().includes(foodSearchText.toLowerCase()))
                                      .slice(0, 50)
                                      .map(food => (
                                        <div 
                                          key={food.nombre} 
                                          onClick={() => {
                                            setSelectedFood(food);
                                            setFoodSearchText(food.nombre);
                                          }}
                                          className="px-4 py-3 hover:bg-white/10 cursor-pointer text-white text-sm border-b border-white/5 last:border-0"
                                        >
                                          {food.nombre}
                                        </div>
                                    ))}
                                    {alimentosData.filter(f => f.nombre.toLowerCase().includes(foodSearchText.toLowerCase())).length === 0 && (
                                      <div className="px-4 py-3 text-gray-500 text-sm italic">
                                        No se encontraron alimentos.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                               <input 
                                  type="text" 
                                  placeholder="Ej: 1 cucharada"
                                  value={activeSearchComidaId === comida.id ? foodCantidad : ''}
                                  onChange={(e) => {
                                      setActiveSearchComidaId(comida.id);
                                      setFoodCantidad(e.target.value);
                                  }}
                                  onFocus={() => setActiveSearchComidaId(comida.id)}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-sm"
                                />
                            </td>
                            <td className="p-3">
                               <input 
                                  type="number" 
                                  placeholder="100"
                                  value={activeSearchComidaId === comida.id ? foodGrams : ''}
                                  onChange={(e) => {
                                      setActiveSearchComidaId(comida.id);
                                      setFoodGrams(Number(e.target.value));
                                  }}
                                  onFocus={() => setActiveSearchComidaId(comida.id)}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-sm"
                                />
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => addAlimentoToComida(comida.id)}
                                disabled={activeSearchComidaId !== comida.id || !selectedFood || foodGrams <= 0}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full text-sm"
                              >
                                Añadir
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
              
              {comidas.length === 0 && (
                <div className="text-center text-gray-500 py-10 opacity-70">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No has registrado ninguna comida todavía.</p>
                </div>
              )}
            </div>
            
             <div className="flex justify-end pt-4 border-t border-white/10 mt-auto">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-[0_0_15px_rgba(22,163,74,0.3)] transition-colors flex items-center font-medium"
                >
                  <Save className="w-4 h-4 mr-2" /> Guardar R24H
                </button>
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

        {/* TAB: Cálculo R24H */}
        {activeTab === 'calculo' && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 border-b border-white/10 pb-2 flex items-center">
              <Calculator className="w-5 h-5 mr-2" /> Balance y Adecuación Dïaria
            </h3>
            
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-4">
              <p className="text-sm text-green-300/80">
                Los datos nutricionales se calculan automáticamente a partir de los alimentos agregados en la pestaña <b>R24H</b>.
              </p>
            </div>

            <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/5 relative z-0">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-3 px-4">Alimento</th>
                    <th className="py-3 px-2 text-right">Cant. (g)</th>
                    <th className="py-3 px-2 text-right">Kcal</th>
                    <th className="py-3 px-2 text-right">Carbos</th>
                    <th className="py-3 px-2 text-right">Prot</th>
                    <th className="py-3 px-2 text-right">Grasas</th>
                    <th className="py-3 px-2 text-right">Fibra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {calculoNutricional.map(item => (
                    <tr key={item.id} className="hover:bg-white/5 text-gray-300">
                      <td className="py-2 px-4 font-medium text-amber-200 truncate max-w-[200px]" title={item.nombre}>{item.nombre}</td>
                      <td className="py-2 px-2 text-right">{item.gramos}</td>
                      <td className="py-2 px-2 text-right">{item.kcal.toFixed(1)}</td>
                      <td className="py-2 px-2 text-right">{item.hco.toFixed(1)}</td>
                      <td className="py-2 px-2 text-right">{item.proteinas.toFixed(1)}</td>
                      <td className="py-2 px-2 text-right">{item.lipidos.toFixed(1)}</td>
                      <td className="py-2 px-2 text-right">{item.fibra.toFixed(1)}</td>
                    </tr>
                  ))}
                  {calculoNutricional.length === 0 && (
                    <tr><td colSpan="7" className="text-center py-8 text-gray-500 italic">No hay alimentos añadidos para el cálculo.</td></tr>
                  )}
                  {calculoNutricional.length > 0 && (
                    <tr className="bg-amber-500/15 font-bold text-amber-300 border-t border-amber-500/30 align-top">
                      <td className="py-3 px-4 pt-4">TOTALES</td>
                      <td className="py-3 px-2 text-right pt-4">{calculoNutricional.reduce((acc, item) => acc + item.gramos, 0)}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="pt-1">{calculoNutricional.reduce((acc, item) => acc + item.kcal, 0).toFixed(1)}</div>
                        {requerimientos && renderProgressBar(calculoNutricional.reduce((acc, item) => acc + item.kcal, 0), requerimientos.kcal, 'kcal')}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="pt-1">{calculoNutricional.reduce((acc, item) => acc + item.hco, 0).toFixed(1)}</div>
                        {requerimientos && renderProgressBar(calculoNutricional.reduce((acc, item) => acc + item.hco, 0), requerimientos.carbohidratos, 'g')}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="pt-1">{calculoNutricional.reduce((acc, item) => acc + item.proteinas, 0).toFixed(1)}</div>
                        {requerimientos && renderProgressBar(calculoNutricional.reduce((acc, item) => acc + item.proteinas, 0), requerimientos.proteinas, 'g')}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="pt-1">{calculoNutricional.reduce((acc, item) => acc + item.lipidos, 0).toFixed(1)}</div>
                        {requerimientos && renderProgressBar(calculoNutricional.reduce((acc, item) => acc + item.lipidos, 0), requerimientos.grasas, 'g')}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="pt-1">{calculoNutricional.reduce((acc, item) => acc + item.fibra, 0).toFixed(1)}</div>
                        {requerimientos && renderProgressBar(calculoNutricional.reduce((acc, item) => acc + item.fibra, 0), requerimientos.fibra, 'g')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Micronutrientes Destacados */}
            {calculoNutricional.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-transform hover:scale-105 flex flex-col items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Vitamina C</div>
                    <div className="text-xl font-bold text-white">{calculoNutricional.reduce((a, b) => a + b.vit_c, 0).toFixed(1)} <span className="text-sm font-normal text-gray-400">mg</span></div>
                  </div>
                  {requerimientos && renderProgressBar(calculoNutricional.reduce((a, b) => a + b.vit_c, 0), requerimientos.vitaminaC, 'mg')}
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-transform hover:scale-105 flex flex-col items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Hierro</div>
                    <div className="text-xl font-bold text-white">{calculoNutricional.reduce((a, b) => a + b.hierro, 0).toFixed(1)} <span className="text-sm font-normal text-gray-400">mg</span></div>
                  </div>
                  {requerimientos && renderProgressBar(calculoNutricional.reduce((a, b) => a + b.hierro, 0), requerimientos.hierro, 'mg')}
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-transform hover:scale-105 flex flex-col items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Calcio</div>
                    <div className="text-xl font-bold text-white">{calculoNutricional.reduce((a, b) => a + b.calcio, 0).toFixed(0)} <span className="text-sm font-normal text-gray-400">mg</span></div>
                  </div>
                  {requerimientos && renderProgressBar(calculoNutricional.reduce((a, b) => a + b.calcio, 0), requerimientos.calcio, 'mg')}
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-transform hover:scale-105 flex flex-col items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Sodio</div>
                    <div className="text-xl font-bold text-white">{calculoNutricional.reduce((a, b) => a + b.sodio, 0).toFixed(0)} <span className="text-sm font-normal text-gray-400">mg</span></div>
                  </div>
                  {requerimientos && renderProgressBar(calculoNutricional.reduce((a, b) => a + b.sodio, 0), requerimientos.sodio, 'mg')}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
