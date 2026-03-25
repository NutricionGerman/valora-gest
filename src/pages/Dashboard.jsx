import React from 'react';
import { User, Activity, PieChart, FileText, ArrowRight, Stethoscope, Dna } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const modules = [
    { title: 'Filiación Clínica', desc: 'Datos personales y antecedentes', path: '/clinica', icon: User, color: 'from-blue-500 to-cyan-400' },
    { title: 'Valoración Clínica', desc: 'Signos vitales y examen físico', path: '/valoracion-clinica', icon: Stethoscope, color: 'from-[var(--color-accent-teal)] to-blue-400' },
    { title: 'P. Bioquímicos', desc: 'Laboratorios y deficiencias', path: '/parametros-bioquimicos', icon: Dna, color: 'from-indigo-400 to-purple-500' },
    { title: 'Antropometría', desc: 'Peso, IMC y percentiles', path: '/antropometria', icon: Activity, color: 'from-[var(--color-accent-green)] to-emerald-400' },
    { title: 'H. Alimentaria', desc: 'Evaluación nutricional', path: '/historia-alimentaria', icon: PieChart, color: 'from-[var(--color-accent-orange)] to-[var(--color-accent-yellow)]' },
    { title: 'Reportes', desc: 'Generar PDF', path: '/reportes', icon: FileText, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a ValoraGest</h2>
        <p className="text-gray-400">Seleccione un módulo para comenzar la valoración de la paciente.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <Link 
            key={mod.path} 
            to={mod.path}
            className="relative overflow-hidden group rounded-2xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-lg hover:shadow-xl hover:border-white/20"
          >
            <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${mod.color}`} />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <mod.icon className="w-8 h-8 mb-4 text-gray-300 group-hover:text-white transition-colors" />
                <h3 className="text-xl font-semibold text-white mb-1">{mod.title}</h3>
                <p className="text-sm text-gray-400">{mod.desc}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
