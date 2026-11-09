import React from 'react';
import { 
  AlertTriangle, 
  Cpu, 
  Calculator, 
  ShieldCheck, 
  Scale, 
  GraduationCap 
} from 'lucide-react';

export const TABS = [
  {
    id: 'overview',
    label: 'Incident & Workload Overview',
    shortLabel: 'Overview',
    icon: AlertTriangle,
    badge: 'Peak Dinner',
    desc: 'Incident post-mortem & 24hr diurnal traffic dynamics'
  },
  {
    id: 'simulator',
    label: 'Live Architecture Simulator',
    shortLabel: 'Simulator',
    icon: Cpu,
    badge: 'Interactive',
    desc: 'Real-time topology, fault injection & packet flow'
  },
  {
    id: 'capacity',
    label: 'Capacity Requirements Sizer',
    shortLabel: 'Capacity Sizer',
    icon: Calculator,
    badge: "Little's Law",
    desc: 'Queueing theory, vCPU, RAM, IOPS & cloud tiers'
  },
  {
    id: 'controls',
    label: 'Operational Controls & Policies',
    shortLabel: 'Controls',
    icon: ShieldCheck,
    badge: '4 Pillars',
    desc: 'HPA, KEDA, PgBouncer, XFetch & Circuit Breakers'
  },
  {
    id: 'evaluation',
    label: 'K5 Evaluation & Synthesis',
    shortLabel: 'Evaluation',
    icon: Scale,
    badge: 'K5 Level',
    desc: 'Cost vs reliability trade-offs & architectural benchmarks'
  },
  {
    id: 'viva',
    label: 'Academic Paper & Viva Deck',
    shortLabel: 'Viva Deck',
    icon: GraduationCap,
    badge: 'CO3 Syllabus',
    desc: 'Complete research write-up & oral exam flashcards'
  }
];

export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/60 sticky top-[92px] md:top-[85px] z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                      isActive
                        ? 'bg-orange-500/25 text-orange-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

