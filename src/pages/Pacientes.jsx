import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('pacientes_list');
    if (saved) {
      setPacientes(JSON.parse(saved));
    }
  }, []);

  const handleCrearPaciente = (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const id = Date.now().toString(); // unique ID
    const newPaciente = {
      id,
      nombre: nuevoNombre.trim(),
      fechaCreacion: new Date().toISOString()
    };

    const updatedList = [...pacientes, newPaciente];
    setPacientes(updatedList);
    localStorage.setItem('pacientes_list', JSON.stringify(updatedList));
    
    setNuevoNombre('');
    setShowModal(false);
    
    // Auto select
    handleSelectPaciente(newPaciente);
  };

  const handleSelectPaciente = (paciente) => {
    localStorage.setItem('current_paciente_id', paciente.id);
    localStorage.setItem('current_paciente_nombre', paciente.nombre);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-rose-400">
              Gestión de Pacientes
            </h1>
            <p className="text-gray-400 mt-2">ValoraGest - Valoración Nutricional en el Embarazo</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 rounded-xl font-medium shadow-lg shadow-teal-500/20 transition-all"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Nuevo Paciente
          </button>
        </header>

        {pacientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
            <Users className="w-16 h-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay pacientes registrados</h3>
            <p className="text-gray-400 max-w-sm mb-6">Comienza registrando a tu primera paciente para iniciar su historia clínica y valoración nutricional.</p>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Nuevo Paciente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pacientes.map(paciente => (
              <div 
                key={paciente.id} 
                onClick={() => handleSelectPaciente(paciente)}
                className="group cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-500/50 rounded-2xl p-6 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full -z-10" />
                
                <div className="flex items-center mb-4">
                  <div className="bg-white/10 p-3 rounded-full mr-4 text-teal-400 group-hover:bg-teal-500/20 group-hover:text-teal-300 transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{paciente.nombre}</h3>
                    <p className="text-xs text-gray-500">
                      ID: {paciente.id.slice(-6)} • Creada: {new Date(paciente.fechaCreacion).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Abrir Historia Clínica <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#1a1c23] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Registrar Nuevo Paciente</h2>
            <form onSubmit={handleCrearPaciente}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  value={nuevoNombre}
                  onChange={e => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Ana Pérez"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-xl font-medium transition-colors"
                >
                  Crear y Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
