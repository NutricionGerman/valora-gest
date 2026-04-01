import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, User, Activity, FileText, PieChart, Stethoscope, Dna, Users, ClipboardList, Salad } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Anamnesis', path: '/anamnesis', icon: User },
    { name: 'Valoración C.', path: '/valoracion-clinica', icon: Stethoscope },
    { name: 'Bioquímica', path: '/parametros-bioquimicos', icon: Dna },
    { name: 'Antropometría', path: '/antropometria', icon: Activity },
    { name: 'Historia', path: '/historia-alimentaria', icon: PieChart },
    { name: 'Diagnóstico', path: '/diagnostico', icon: ClipboardList },
    { name: 'Intervención N.', path: '/intervencion-nutricional', icon: Salad },
    { name: 'Reportes', path: '/reportes', icon: FileText },
  ];

  const currentPatientName = localStorage.getItem('current_paciente_nombre');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-primary-dark)] text-white font-sans">
      {/* Top Header */}
      <header className="bg-white/5 backdrop-blur-md border-b flex items-center justify-between p-4 border-[var(--color-glass-border)] z-10 shrink-0">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-[var(--color-accent-teal)] to-[var(--color-accent-green)] bg-clip-text text-transparent">
          ValoraGest
        </h1>
        {currentPatientName && (
          <Link to="/pacientes" className="flex items-center text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
            <User className="w-4 h-4 mr-2 text-teal-400" />
            <span className="font-medium truncate max-w-[120px] md:max-w-[200px]">{currentPatientName}</span>
          </Link>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-6 pb-24 md:pb-6 relative safe-area-bottom">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile mostly, adaptable to side on larger if needed) */}
      <nav className="fixed md:hidden bottom-0 w-full bg-[#1c1d21]/90 backdrop-blur-lg border-t border-[var(--color-glass-border)] pb-safe z-20">
        <div className="flex overflow-x-auto items-center h-16 px-2 scrollbar-none gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center min-w-[60px] h-full transition-colors duration-200 shrink-0',
                  isActive ? 'text-[var(--color-accent-teal)]' : 'text-gray-400 hover:text-gray-200'
                )
              }
            >
              <item.icon className="w-6 h-6 mb-1" strokeWidth={2} />
              <span className="text-[10px] font-medium tracking-wide whitespace-nowrap">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-[#1c1d21]/90 backdrop-blur-lg border-r border-[var(--color-glass-border)] z-20">
        <div className="flex flex-col py-6 space-y-2 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive 
                    ? 'bg-white/10 text-[var(--color-accent-teal)] font-medium shadow-md' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                )
              }
            >
              <item.icon className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Adjust desktop main layout padding to account for sidebar */}
      <style>{`
        @media (min-width: 768px) {
          main { margin-left: 16rem; max-width: calc(100% - 16rem); }
        }
      `}</style>
    </div>
  );
}
