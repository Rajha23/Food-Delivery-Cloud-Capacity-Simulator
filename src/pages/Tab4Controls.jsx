import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Zap, 
  Database, 
  Activity, 
  CheckCircle2, 
  ChevronRight,
  Code2,
  FileText,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { OPERATIONAL_PILLARS, CIRCUIT_BREAKER_STATES } from '../data/operationalControls';
import CodeSnippetViewer from '../components/CodeSnippetViewer';

export default function Tab4Controls() {
  const [selectedPillarId, setSelectedPillarId] = useState('elasticity');
  
  // Circuit breaker simulation state
  const [cbFailureRate, setCbFailureRate] = useState(25);
  const [cbSlowCalls, setCbSlowCalls] = useState(20);

  // Derive circuit breaker state dynamically
  let cbState = 'CLOSED';
  if (cbFailureRate >= 40 || cbSlowCalls >= 50) {
    cbState = 'OPEN';
  } else if (cbFailureRate >= 30 || cbSlowCalls >= 35) {
    cbState = 'HALF_OPEN';
  }

  const activePillar = OPERATIONAL_PILLARS.find(p => p.id === selectedPillarId) || OPERATIONAL_PILLARS[0];

  const codeSnippets = OPERATIONAL_PILLARS.map(p => ({
    title: p.codeSnippet.title,
    language: p.codeSnippet.language,
    code: p.codeSnippet.code,
    note: `Active in Pillar ${p.title.split('.')[0]}: ${p.badge}`
  }));

  return (
    <div className="space-y-6">
      {/* Header Context Strip */}
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                Operational Management Framework & Defensive Controls
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Recommended Approach
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Four architectural pillars designed to eliminate 504 timeouts, cache stampedes, and database crashes during peak dinner
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Tab Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {OPERATIONAL_PILLARS.map((pillar) => {
          const isSelected = selectedPillarId === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillarId(pillar.id)}
              className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] ${
                isSelected
                  ? 'border-orange-500/50 bg-slate-900/90 shadow-lg shadow-orange-500/10'
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  isSelected ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {pillar.badge}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
              </div>
              <h3 className="text-xs font-bold text-slate-100 mb-1">{pillar.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {pillar.summary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed View of Active Pillar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-wider block">
              Pillar Focus: {activePillar.badge}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{activePillar.title}</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 max-w-md">
            <strong>Target Failure Mitigated:</strong> {activePillar.problemAddressed}
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePillar.controls.map((ctrl, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-orange-400 font-bold">
                  {idx + 1}
                </span>
                <span>{ctrl.name}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {ctrl.description}
              </p>
              <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="text-slate-500">Industry Tooling:</span>
                <span className="text-sky-300 font-semibold">{ctrl.tooling}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Circuit Breaker State Machine Simulation */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Interactive Resilience4j Circuit Breaker State Machine
            </h3>
            <p className="text-xs text-slate-400">
              Drag failure sliders to observe how circuit breakers protect threads from slow third-party payment APIs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Active State:</span>
            <span className={`text-xs px-3 py-1 rounded-full font-mono font-bold border ${
              cbState === 'CLOSED'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : (cbState === 'HALF_OPEN' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse')
            }`}>
              {cbState}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Sliders (5 cols) */}
          <div className="md:col-span-5 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Payment Error Rate (%):</span>
                <span className="font-mono font-bold text-orange-400">{cbFailureRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cbFailureRate}
                onChange={(e) => setCbFailureRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-[10px] text-slate-500">Trip Threshold: &gt;= 40%</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Slow Calls (&gt;2.5s) (%):</span>
                <span className="font-mono font-bold text-orange-400">{cbSlowCalls}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cbSlowCalls}
                onChange={(e) => setCbSlowCalls(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-[10px] text-slate-500">Slow Call Threshold: &gt;= 50%</span>
            </div>
          </div>

          {/* State Visualizer (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-3 gap-3">
            {/* CLOSED */}
            <div className={`p-3.5 rounded-xl border text-center transition-all ${
              cbState === 'CLOSED'
                ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-950'
                : 'border-slate-800 bg-slate-950/40 opacity-40'
            }`}>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <span className="text-xs font-bold text-emerald-400 block mb-1">CLOSED</span>
              <p className="text-[10px] text-slate-300">
                Normal calls pass. Metrics recorded in sliding window.
              </p>
            </div>

            {/* OPEN */}
            <div className={`p-3.5 rounded-xl border text-center transition-all ${
              cbState === 'OPEN'
                ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-950'
                : 'border-slate-800 bg-slate-950/40 opacity-40'
            }`}>
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <span className="text-xs font-bold text-rose-400 block mb-1">OPEN (TRIPPED)</span>
              <p className="text-[10px] text-slate-300">
                Fails fast immediately. Zero worker threads blocked.
              </p>
            </div>

            {/* HALF-OPEN */}
            <div className={`p-3.5 rounded-xl border text-center transition-all ${
              cbState === 'HALF_OPEN'
                ? 'border-amber-500 bg-amber-950/30 shadow-lg shadow-amber-950'
                : 'border-slate-800 bg-slate-950/40 opacity-40'
            }`}>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <span className="text-xs font-bold text-amber-400 block mb-1">HALF-OPEN</span>
              <p className="text-[10px] text-slate-300">
                Allows 10 trial requests to verify downstream recovery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Production Infrastructure Manifests Code Viewer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-orange-400" />
            Production Configuration Manifests (Ready to Deploy)
          </h3>
          <span className="text-xs text-slate-400 font-mono">YAML & JavaScript</span>
        </div>
        <CodeSnippetViewer snippets={codeSnippets} />
      </div>
    </div>
  );
}
