import React from 'react';
import CapacityCalculator from '../components/CapacityCalculator';
import { Calculator, Award, Layers, Cpu, Server, Database } from 'lucide-react';

export default function Tab3Capacity() {
  return (
    <div className="space-y-6">
      {/* Header Context Strip */}
      <div className="p-4 rounded-xl border border-sky-500/30 bg-gradient-to-r from-sky-950/30 via-slate-900 to-slate-950 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                Course Outcome CO3: Cloud Capacity Requirements Analysis
                <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                  Bloom's Level K5 (Evaluate / Synthesize)
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Mathematical modeling of throughput, concurrency, resource saturation, and multi-cloud infrastructure dimensioning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Syllabus: Cloud Services / Distributed Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Embedded Sizer Engine */}
      <CapacityCalculator />
    </div>
  );
}
