import React from 'react';
import { 
  CloudLightning, 
  FileText, 
  Award, 
  Users, 
  Activity, 
  Sparkles,
  Server,
  Layers
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenReport,
  simMode,
  setSimMode 
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Academic Metadata Strip */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-sky-950/60 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30">
              <Award className="w-3 h-3" /> Problem #29
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono border border-sky-500/20">
              K5 (Evaluate / Synthesize)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono border border-emerald-500/20">
              CO3 (Cloud Capacity & Operations)
            </span>
            <span className="hidden md:inline text-slate-400">
              Cloud Services & Computing Mini-Project
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-medium text-slate-200">Team:</span>
              <span className="text-slate-300 font-mono">
                <strong className="text-white">814724104167</strong> VIJAYA RAJHA K
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">
                <strong className="text-white">814724104174</strong> VISHVAA M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Branding & Top Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-600 to-sky-600 p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <CloudLightning className="w-5 h-5 text-orange-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-orange-200 bg-clip-text text-transparent">
                  PeakDinner CloudResilience™
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 font-medium">
                  SRE Simulator & Capacity Sizer
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Workload Pattern Analysis & Operational Management Controls for Food-Delivery Peak Surges
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 text-xs">
              <button
                onClick={() => setSimMode('unmanaged')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  simMode === 'unmanaged'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Simulate baseline without operational controls (Failures occur)"
              >
                <span className="w-2 h-2 rounded-full bg-rose-300 animate-ping" />
                Baseline (Unmanaged)
              </button>
              <button
                onClick={() => setSimMode('managed')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  simMode === 'managed'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Activate recommended operational management controls (Resilient)"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                Optimized (Controls Active)
              </button>
            </div>

            {/* 20-Page PDF Download & Report Trigger */}
            <a
              href="./Problem_29_Cloud_Capacity_20_Page_Report.pdf"
              download="Problem_29_Cloud_Capacity_20_Page_Report.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition shadow-sm"
              title="Download official 20-page academic report as PDF"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Download 20-Page PDF</span>
            </a>

            <button
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 hover:border-slate-600 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>View Report Modal</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

