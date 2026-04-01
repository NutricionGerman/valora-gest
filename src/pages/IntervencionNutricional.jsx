import { useState } from 'react';
import { Utensils, ExternalLink } from 'lucide-react';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // e.g. '/valora-gest'
const PLANNER_PATH = `${BASE}/planificador-nutricional/planificacion-nutricional.html`;

const TABS = [
  {
    id: 'planificacion',
    label: 'Planificación Nutricional',
    icon: Utensils,
  },
];

export default function IntervencionNutricional() {
  const [activeTab, setActiveTab] = useState('planificacion');

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--color-accent-teal)] to-[var(--color-accent-green)] bg-clip-text text-transparent">
          Intervención Nutricional
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Herramientas para la planificación y seguimiento de la intervención nutricional en el embarazo.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex space-x-2 border-b border-[var(--color-glass-border)] pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all duration-200 border border-b-0 ${
              activeTab === tab.id
                ? 'bg-white/10 text-[var(--color-accent-teal)] border-[var(--color-glass-border)]'
                : 'text-gray-400 hover:text-gray-200 border-transparent hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'planificacion' && (
        <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-[var(--color-glass-border)] bg-white/5 min-h-[600px]">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-[var(--color-glass-border)] shrink-0">
            <span className="text-xs text-gray-400 font-medium">Planificador Nutricional Embarazo</span>
            <a
              href={PLANNER_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--color-accent-teal)] hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir en nueva pestaña
            </a>
          </div>

          {/* iFrame */}
          <iframe
            src={PLANNER_PATH}
            title="Planificación Nutricional"
            className="flex-1 w-full"
            style={{ minHeight: '700px', border: 'none', background: 'white' }}
            allow="fullscreen"
          />
        </div>
      )}
    </div>
  );
}
