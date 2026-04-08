import React, { useState, useEffect, useCallback } from 'react';
import { Save, Clock, Heart, Calculator, Plus, Trash2, Search, X, Activity, Edit3, RotateCcw, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { alimentos as alimentosData } from '../data/alimentos';
import { calcularRequerimientosPaciente } from '../data/requerimientos';
import { infoClinica } from '../data/infoClinica';

export default function HistoriaAlimentaria() {
  const [activeTab, setActiveTab] = useState('recordatorio');

  // Estado unificado de comidas para RM24H
  const [comidas, setComidas] = useState([
    { id: Date.now().toString(), nombre: 'Comida 1', descripcionTexto: '', alimentos: [] }
  ]);

  // Buscador de alimentos activo por cada comida particular
  const [activeSearchComidaId, setActiveSearchComidaId] = useState(null);
  const [foodSearchText, setFoodSearchText] = useState('');
  const [showRecRecord, setShowRecRecord] = useState(false);
  const [selectedNutrient, setSelectedNutrient] = useState(null); // { info, rdaKey, unit, standardRda }
  const [customRDAs, setCustomRDAs] = useState({});       // { rdaKey: { value: number, active: boolean } }
  const [editRdaValue, setEditRdaValue] = useState('');   // valor en el input del modal
  const [editRdaActive, setEditRdaActive] = useState(false); // toggle 'usar personalizado'
  const [rdaSaved, setRdaSaved] = useState(false);        // feedback visual al guardar
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
  
  // Estado para el Explorador de Alimentos
  const [exploradorFoods, setExploradorFoods] = useState([]);
  const [exploradorSelectedName, setExploradorSelectedName] = useState('');

  // Array derivado de alimentos para la tabla total
  const calculoNutricional = comidas.reduce((acc, comida) => [...acc, ...comida.alimentos], []);


  useEffect(() => {
    const patientId = localStorage.getItem('current_paciente_id');
    const saved = localStorage.getItem(`historia_alimentaria_${patientId}`);
    
    // Carga de Demografía para cálculo RDA
    const anamnesis = JSON.parse(localStorage.getItem(`anamnesis_${patientId}`) || '{}');
    const antro = JSON.parse(localStorage.getItem(`antropometria_${patientId}`) || '{}');
    const pesoUsar = antro.pesoActual || antro.peso || 60;
    const rda = calcularRequerimientosPaciente(anamnesis.edad, pesoUsar, anamnesis.semanasGestacion);
    setRequerimientos(rda);

    // Cargar RDAs personalizados del paciente
    const savedCustom = localStorage.getItem(`custom_rdas_${patientId}`);
    if (savedCustom) setCustomRDAs(JSON.parse(savedCustom));

    if (saved) {
      const data = JSON.parse(saved);
      if (data.comidas && data.comidas.length > 0) setComidas(data.comidas);
      if (data.preferencias) setPreferencias(data.preferencias);
    }
  }, []);

  // Abrir modal con datos completos (info clínica + edición de RDA)
  const openNutrientModal = useCallback((info, rdaKey, unit, standardRda) => {
    setSelectedNutrient({ info, rdaKey, unit, standardRda });
    const custom = customRDAs[rdaKey];
    setEditRdaValue(custom ? String(custom.value) : String(standardRda ?? ''));
    setEditRdaActive(custom ? custom.active : false);
    setRdaSaved(false);
  }, [customRDAs]);

  // Guardar RDA personalizada
  const saveCustomRda = useCallback(() => {
    if (!selectedNutrient?.rdaKey) return;
    const patientId = localStorage.getItem('current_paciente_id');
    const val = parseFloat(editRdaValue);
    if (isNaN(val) || val <= 0) return;
    const updated = {
      ...customRDAs,
      [selectedNutrient.rdaKey]: { value: val, active: editRdaActive }
    };
    setCustomRDAs(updated);
    localStorage.setItem(`custom_rdas_${patientId}`, JSON.stringify(updated));
    setRdaSaved(true);
    setTimeout(() => setRdaSaved(false), 2000);
  }, [selectedNutrient, editRdaValue, editRdaActive, customRDAs]);

  // Restaurar RDA al valor estándar
  const resetCustomRda = useCallback(() => {
    if (!selectedNutrient?.rdaKey) return;
    const patientId = localStorage.getItem('current_paciente_id');
    const updated = { ...customRDAs };
    delete updated[selectedNutrient.rdaKey];
    setCustomRDAs(updated);
    localStorage.setItem(`custom_rdas_${patientId}`, JSON.stringify(updated));
    setEditRdaValue(String(selectedNutrient.standardRda ?? ''));
    setEditRdaActive(false);
    setRdaSaved(false);
  }, [selectedNutrient, customRDAs]);

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
        // Macronutrientes
        hco: selectedFood.hco * ratio,
        proteinas: selectedFood.proteinas * ratio,
        lipidos: selectedFood.lipidos * ratio,
        fibra: selectedFood.fibra * ratio,
        colesterol: (selectedFood.colesterol || 0) * ratio,
        // Ácidos grasos
        ags: (selectedFood.ags || 0) * ratio,
        agm: (selectedFood.agm || 0) * ratio,
        agp: (selectedFood.agp || 0) * ratio,
        omega_6: (selectedFood.omega_6 || 0) * ratio,
        omega_3_ALA: (selectedFood.omega_3_ALA || 0) * ratio,
        omega_3_EPA: (selectedFood.omega_3_EPA || 0) * ratio,
        omega_3_DHA: (selectedFood.omega_3_DHA || 0) * ratio,
        // Vitaminas
        vit_a: (selectedFood.vit_a || 0) * ratio,
        b1: (selectedFood.b1 || 0) * ratio,
        b2: (selectedFood.b2 || 0) * ratio,
        b3: (selectedFood.b3 || 0) * ratio,
        b6: (selectedFood.b6 || 0) * ratio,
        b9: (selectedFood.b9 || 0) * ratio,
        b12: (selectedFood.b12 || 0) * ratio,
        vit_c: selectedFood.vit_c * ratio,
        vit_d: (selectedFood.vit_d || 0) * ratio,
        vit_e: (selectedFood.vit_e || 0) * ratio,
        vit_k: (selectedFood.vit_k || 0) * ratio,
        // Minerales
        calcio: selectedFood.calcio * ratio,
        fosforo: (selectedFood.fosforo || 0) * ratio,
        magnesio: (selectedFood.magnesio || 0) * ratio,
        hierro: selectedFood.hierro * ratio,
        zinc: (selectedFood.zinc || 0) * ratio,
        cobre: (selectedFood.cobre || 0) * ratio,
        selenio: (selectedFood.selenio || 0) * ratio,
        potasio: (selectedFood.potasio || 0) * ratio,
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

  const addFoodToExplorador = () => {
    if (exploradorSelectedName) {
      const food = alimentosData.find(f => f.nombre === exploradorSelectedName);
      if (food) {
        setExploradorFoods([{ ...food, uniqueId: Date.now().toString() }, ...exploradorFoods]);
      }
    }
  };

  const removeFoodFromExplorador = (uniqueId) => {
    setExploradorFoods(exploradorFoods.filter(f => f.uniqueId !== uniqueId));
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
          { id: 'calculo', label: 'Cálculo R24H', icon: Calculator, color: 'text-amber-400' },
          { id: 'explorador', label: 'Explorador', icon: Search, color: 'text-purple-400' }
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
            
            {/* Panel completo de Micronutrientes */}
            {calculoNutricional.length > 0 && (() => {
              const sum = (field) => calculoNutricional.reduce((a, b) => a + (Number(b[field]) || 0), 0);

              // UL (Límite Máximo Tolerable) IOM para embarazo
              // ⚠️ Magnesio: el UL de 350mg aplica SOLO a suplementos, no a alimentos. Sin UL dietético.
              const ulValues = {
                vit_a: 3000, b3: 35, b6: 100, b9: 1000,
                vit_c: 2000, vit_d: 100, vit_e: 1000,
                calcio: 2500, hierro: 45, zinc: 40,
                fosforo: 3500, sodio: 2300, selenio: 400,
                cobre: 10,
                // Sin UL dietético: B1, B2, B12, K, Mg, potasio, ácidos grasos
              };

              const standardRdaValues = {
                vit_c: requerimientos?.vitaminaC || 105,
                hierro: requerimientos?.hierro || 16,
                calcio: requerimientos?.calcio || 950,
                sodio: requerimientos?.sodio || 1500,
                vit_a: 770, b1: 1.4, b2: 1.4, b3: 18, b6: 1.9, b9: 600, b12: 2.6,
                vit_d: 15, vit_e: 15, vit_k: 90,
                fosforo: 700, magnesio: 350, zinc: 11,
                cobre: 1, selenio: 60, potasio: 2900,
                omega_3_ALA: 1.4, omega_6_LA: 13
              };

              const MicroCard = ({ label, value, unit, rdaKey, ulKey }) => {
                const aiNutrients = ['sodio', 'potasio', 'vit_k', 'omega_3_ALA', 'omega_6_LA', 'fibra'];
                const isAI = aiNutrients.includes(rdaKey);

                const standardRda = rdaKey ? standardRdaValues[rdaKey] : null;
                // Usar RDA personalizado si existe y está activo
                const customEntry = rdaKey ? customRDAs[rdaKey] : null;
                const rda = (customEntry?.active && customEntry?.value) ? customEntry.value : standardRda;
                const isCustom = !!(customEntry?.active && customEntry?.value);

                const ul = ulKey ? ulValues[ulKey] : null;
                const pct = rda ? (value / rda) * 100 : null;
                const barColor = pct == null ? ''
                  : (ul && value > ul) ? 'bg-red-500'
                  : pct >= 90 ? 'bg-green-500'
                  : pct >= 50 ? 'bg-amber-500'
                  : 'bg-blue-500';

                const barWidth = rda ? Math.min((value / rda) * 100, 100) : 0;
                const exceedsUL = ul && value > ul;
                const info = rdaKey ? infoClinica[rdaKey] : null;

                return (
                  <div
                    onClick={() => (info || rdaKey) && openNutrientModal(info, rdaKey, unit, standardRda)}
                    className={`bg-black/20 border ${exceedsUL ? 'border-red-500/50' : isCustom ? 'border-violet-500/40' : 'border-white/5'} rounded-xl p-3 flex flex-col gap-1 transition-all hover:scale-105 active:scale-95 ${(info || rdaKey) ? 'cursor-pointer hover:bg-white/5' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight">{label}</div>
                      <div className="flex items-center gap-1">
                        {isCustom && <span className="text-[9px] text-violet-400 font-bold">CUSTOM</span>}
                        {info && !isCustom && <span className="text-[9px] text-blue-400 font-bold opacity-50">INFO</span>}
                      </div>
                    </div>
                    <div className={`text-base font-bold ${exceedsUL ? 'text-red-400' : 'text-white'}`}>
                      {value.toFixed(value < 10 ? 2 : 1)} <span className="text-xs font-normal text-gray-400">{unit}</span>
                      {exceedsUL && <span className="ml-1 text-[9px] bg-red-500/20 text-red-400 px-1 rounded">↑UL</span>}
                    </div>
                    {rda && (
                      <>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${barWidth}%` }} />
                        </div>
                        <div className="text-[9px] text-gray-500 text-right">
                          {Math.round(pct)}% <span className="font-bold">{isAI ? 'IA' : 'RDA'}</span>
                          {ul && <span className="ml-1 opacity-60">· UL: {ul}{unit}</span>}
                        </div>
                      </>
                    )}
                  </div>
                );
              };

              return (
                <div className="space-y-5 mt-5">
                  {/* VITAMINAS */}
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"/> Vitaminas
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      <MicroCard label="Vit. A"          value={sum('vit_a')}  unit="µg" rdaKey="vit_a" ulKey="vit_a" />
                      <MicroCard label="Vit. B1"         value={sum('b1')}     unit="mg" rdaKey="b1" />
                      <MicroCard label="Vit. B2"         value={sum('b2')}     unit="mg" rdaKey="b2" />
                      <MicroCard label="Vit. B3"         value={sum('b3')}     unit="mg" rdaKey="b3" ulKey="b3" />
                      <MicroCard label="Vit. B6"         value={sum('b6')}     unit="mg" rdaKey="b6" ulKey="b6" />
                      <MicroCard label="Ác. Fólico (B9)" value={sum('b9')}     unit="µg" rdaKey="b9" ulKey="b9" />
                      <MicroCard label="Vit. B12"        value={sum('b12')}    unit="µg" rdaKey="b12" />
                      <MicroCard label="Vit. C"          value={sum('vit_c')}  unit="mg" rdaKey="vit_c" ulKey="vit_c" />
                      <MicroCard label="Vit. D"          value={sum('vit_d')}  unit="µg" rdaKey="vit_d" ulKey="vit_d" />
                      <MicroCard label="Vit. E"          value={sum('vit_e')}  unit="mg" rdaKey="vit_e" ulKey="vit_e" />
                      <MicroCard label="Vit. K"          value={sum('vit_k')}  unit="µg" rdaKey="vit_k" />
                    </div>
                  </div>

                  {/* MINERALES */}
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"/> Minerales
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      <MicroCard label="Calcio"     value={sum('calcio')}    unit="mg" rdaKey="calcio"   ulKey="calcio" />
                      <MicroCard label="Hierro"     value={sum('hierro')}    unit="mg" rdaKey="hierro"   ulKey="hierro" />
                      <MicroCard label="Zinc"       value={sum('zinc')}      unit="mg" rdaKey="zinc"     ulKey="zinc" />
                      <MicroCard label="Magnesio"   value={sum('magnesio')}  unit="mg" rdaKey="magnesio" />
                      <MicroCard label="Fósforo"    value={sum('fosforo')}   unit="mg" rdaKey="fosforo"  ulKey="fosforo" />
                      <MicroCard label="Potasio"    value={sum('potasio')}   unit="mg" rdaKey="potasio" />
                      <MicroCard label="Sodio (IA)" value={sum('sodio')}     unit="mg" rdaKey="sodio"    ulKey="sodio" />
                      <MicroCard label="Selenio"    value={sum('selenio')}   unit="µg" rdaKey="selenio"  ulKey="selenio" />
                      <MicroCard label="Cobre"      value={sum('cobre')}     unit="mg" rdaKey="cobre"    ulKey="cobre" />
                      <MicroCard label="Colesterol" value={sum('colesterol')} unit="mg" />
                    </div>
                  </div>

                  {/* ÁCIDOS GRASOS */}
                  <div>
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"/> Ácidos Grasos
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      <MicroCard label="Saturadas"       value={sum('ags')}          unit="g" />
                      <MicroCard label="Monoinsaturadas" value={sum('agm')}          unit="g" />
                      <MicroCard label="Poliinsaturadas" value={sum('agp')}          unit="g" />
                      <MicroCard label="Omega-6 (LA)"    value={sum('omega_6')}      unit="g" rdaKey="omega_6_LA" />
                      <MicroCard label="Omega-3 (ALA)"   value={sum('omega_3_ALA')}  unit="g" rdaKey="omega_3_ALA" />
                      <MicroCard label="Omega-3 EPA+DHA" value={sum('omega_3_EPA') + sum('omega_3_DHA')} unit="g" />
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 text-right">* RDA o IA (Ingesta Adecuada) según IOM para embarazo · 🟦 &lt;50% · 🟧 50–89% · 🟩 ≥90% · 🟥 supera UL · Haz clic en un nutriente para ver signos de deficiencia</p>
                </div>
              );
            })()}

            {/* Modal de Información Clínica + Editor de RDA */}
            {selectedNutrient && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-[#1a1c1e] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative">
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() => setSelectedNutrient(null)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Encabezado */}
                  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 pt-10 border-b border-white/5">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                        <Activity size={32} />
                      </span>
                      <div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">{selectedNutrient.info?.nombre || selectedNutrient.rdaKey}</h3>
                        <p className="text-blue-400/80 font-medium">Deficiencias · Objetivos Nutricionales</p>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* ── EDITOR DE RDA ── */}
                    {selectedNutrient.rdaKey && (
                      <div className="mx-6 mt-6 bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 space-y-4">
                        <h4 className="text-violet-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <Edit3 size={13} /> Objetivo Diario Personalizado
                        </h4>

                        {/* Slider visual */}
                        {selectedNutrient.standardRda && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-gray-500">
                              <span>0</span>
                              <span className="text-violet-400 font-bold">RDA estándar: {selectedNutrient.standardRda} {selectedNutrient.unit}</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={selectedNutrient.standardRda * 3}
                              step={selectedNutrient.standardRda > 10 ? 5 : 0.1}
                              value={parseFloat(editRdaValue) || 0}
                              onChange={e => setEditRdaValue(e.target.value)}
                              className="w-full accent-violet-500"
                            />
                          </div>
                        )}

                        {/* Input numérico */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="text-[10px] text-gray-400 block mb-1">Objetivo diario (<span className="font-bold">{selectedNutrient.unit}</span>)</label>
                            <input
                              type="number"
                              value={editRdaValue}
                              onChange={e => setEditRdaValue(e.target.value)}
                              className="w-full bg-black/40 border border-violet-500/30 rounded-xl px-4 py-2.5 text-white text-lg font-bold focus:border-violet-500 focus:outline-none"
                            />
                          </div>
                          <div className="pt-5">
                            <button
                              onClick={resetCustomRda}
                              title="Restaurar valor estándar"
                              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-amber-400 transition-colors"
                            >
                              <RotateCcw size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Toggle + Botón guardar */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <div
                              onClick={() => setEditRdaActive(v => !v)}
                              className={`w-10 h-5 rounded-full transition-colors relative ${
                                editRdaActive ? 'bg-violet-500' : 'bg-white/10'
                              }`}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                                editRdaActive ? 'left-5' : 'left-0.5'
                              }`} />
                            </div>
                            <span className="text-xs text-gray-300">Usar valor personalizado en lugar del RDA</span>
                          </label>
                          <button
                            onClick={saveCustomRda}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                              rdaSaved
                                ? 'bg-green-600 text-white'
                                : 'bg-violet-600 hover:bg-violet-500 text-white'
                            }`}
                          >
                            {rdaSaved ? <><CheckCircle size={15} /> Guardado</> : <><Save size={15} /> Guardar</>}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ── INFO CLÍNICA ── */}
                    {selectedNutrient.info && (
                      <div className="p-6 space-y-6">
                        <section>
                          <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Manifestación Principal
                          </h4>
                          <p className="text-lg text-gray-100 font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                            {selectedNutrient.info.resumen}
                          </p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Signos / Síntomas</h4>
                            <div className="space-y-2">
                              {Object.entries(selectedNutrient.info.signos).map(([cat, text]) => (
                                <div key={cat} className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1">
                                    {cat.replace('neurologicos','neurológicos').replace('cutaneos','cutáneos').replace('sistemicos','sistémicos').replace('musculoesqueleticos','musculoesqueléticos')}
                                  </span>
                                  <p className="text-sm text-gray-300 leading-snug">{text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Grupos de Riesgo</h4>
                              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                                <p className="text-sm text-amber-200 leading-relaxed">{selectedNutrient.info.riesgo}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Fuentes Alimentarias</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedNutrient.info.fuentes?.split(', ').map((f, i) => (
                                  <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-200 text-xs font-medium">{f}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-t border-white/5 bg-black/40 text-center">
                    <p className="text-[10px] text-gray-500 italic">
                      Los valores personalizados se guardan por paciente y reemplazan el RDA automático en las barras de adecuación.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Explorador de Alimentos */}
        {activeTab === 'explorador' && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-semibold text-purple-400 mb-4 border-b border-white/10 pb-2 flex items-center">
              <Search className="w-5 h-5 mr-2" /> Explorador de Nutrientes (100g)
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <select 
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                value={exploradorSelectedName}
                onChange={(e) => setExploradorSelectedName(e.target.value)}
              >
                <option value="">Seleccione un alimento...</option>
                {alimentosData.map((food, idx) => (
                  <option key={idx} value={food.nombre}>{food.nombre}</option>
                ))}
              </select>
              <button 
                onClick={addFoodToExplorador}
                disabled={!exploradorSelectedName}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl shadow-lg transition-colors font-medium flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" /> Añadir
              </button>
            </div>

            <div className="space-y-4">
              {exploradorFoods.map(food => (
                <div key={food.uniqueId} className="bg-black/20 relative p-5 rounded-2xl border border-white/5 shadow-sm">
                  <button 
                    onClick={() => removeFoodFromExplorador(food.uniqueId)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors bg-black/40 p-1.5 rounded-full"
                    title="Eliminar Card"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h4 className="text-xl font-bold text-amber-200 mb-4 pr-10">{food.nombre}</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Energía</div>
                      <div className="font-bold text-white">{food.energia || 0} <span className="text-xs font-normal text-gray-400">kcal</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Proteínas</div>
                      <div className="font-bold text-white">{food.proteinas || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Carbos</div>
                      <div className="font-bold text-white">{food.hco || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Grasas Tot.</div>
                      <div className="font-bold text-white">{food.lipidos || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Fibra</div>
                      <div className="font-bold text-white">{food.fibra || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Grasa Sat.</div>
                      <div className="font-bold text-white">{food.ags || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Grasa Mono.</div>
                      <div className="font-bold text-white">{food.agm || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Grasa Poli.</div>
                      <div className="font-bold text-white">{food.agp || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Colesterol</div>
                      <div className="font-bold text-white">{food.colesterol || 0} <span className="text-xs font-normal text-gray-400">mg</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Omega 6 (LA)</div>
                      <div className="font-bold text-white">{food.omega_6 || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Omega 3 (ALA)</div>
                      <div className="font-bold text-white">{food.omega_3_ALA || 0} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Omega 3 (EPA+DHA)</div>
                      <div className="font-bold text-white">{(Number(food.omega_3_EPA||0) + Number(food.omega_3_DHA||0)).toFixed(2)} <span className="text-xs font-normal text-gray-400">g</span></div>
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                      <div className="text-[10px] text-blue-300 uppercase tracking-wider mb-1">Vit C</div>
                      <div className="font-bold text-white">{food.vit_c || 0} <span className="text-xs font-normal text-gray-400">mg</span></div>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                      <div className="text-[10px] text-purple-300 uppercase tracking-wider mb-1">Hierro</div>
                      <div className="font-bold text-white">{food.hierro || 0} <span className="text-xs font-normal text-gray-400">mg</span></div>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                      <div className="text-[10px] text-green-300 uppercase tracking-wider mb-1">Calcio</div>
                      <div className="font-bold text-white">{food.calcio || 0} <span className="text-xs font-normal text-gray-400">mg</span></div>
                    </div>
                    <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                      <div className="text-[10px] text-amber-300 uppercase tracking-wider mb-1">Ácido Fólico</div>
                      <div className="font-bold text-white">{food.b9 || 0} <span className="text-xs font-normal text-gray-400">µg</span></div>
                    </div>
                    <div className="bg-pink-500/10 p-3 rounded-xl border border-pink-500/20">
                      <div className="text-[10px] text-pink-300 uppercase tracking-wider mb-1">Vit B12</div>
                      <div className="font-bold text-white">{food.b12 || 0} <span className="text-xs font-normal text-gray-400">µg</span></div>
                    </div>
                    <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                      <div className="text-[10px] text-indigo-300 uppercase tracking-wider mb-1">Zinc</div>
                      <div className="font-bold text-white">{food.zinc || 0} <span className="text-xs font-normal text-gray-400">mg</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Vit A</div>
                      <div className="font-bold text-white">{food.vit_a || 0} <span className="text-xs font-normal text-gray-400">µg_RAE</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Vit D</div>
                      <div className="font-bold text-white">{food.vit_d || 0} <span className="text-xs font-normal text-gray-400">µg</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Potasio</div>
                      <div className="font-bold text-white">{food.potasio || 0} <span className="text-xs font-normal text-gray-400">mg</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Fósforo</div>
                      <div className="font-bold text-white">{food.fosforo || 0} <span className="text-xs font-normal text-gray-400">mg</span></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Sodio</div>
                      <div className="font-bold text-white">{food.sodio || 0} <span className="text-xs font-normal text-gray-400">mg</span></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {exploradorFoods.length === 0 && (
                <div className="text-center text-gray-500 py-10 opacity-70">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Seleccione un alimento para ver todos sus nutrientes por 100g.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
