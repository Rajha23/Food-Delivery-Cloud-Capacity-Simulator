import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Cpu, 
  Database, 
  HardDrive, 
  Zap, 
  DollarSign, 
  TrendingDown, 
  Layers, 
  BookOpen, 
  Info,
  Server,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { calculateCapacity, CAPACITY_FORMULAS_DOCS } from '../data/capacityFormulas';

export default function CapacityCalculator() {
  // Configurable inputs with realistic defaults
  const [dailyActiveUsers, setDailyActiveUsers] = useState(1500000);
  const [peakMultiplier, setPeakMultiplier] = useState(8.5);
  const [ordersPerMin, setOrdersPerMin] = useState(7500);
  const [avgLatencyMs, setAvgLatencyMs] = useState(150);
  const [cpuTimePerReqMs, setCpuTimePerReqMs] = useState(12);
  const [payloadSizeKb, setPayloadSizeKb] = useState(35);
  const [targetCpuUtilization, setTargetCpuUtilization] = useState(65);
  const [cacheHitRatio, setCacheHitRatio] = useState(90);
  const [activeFormulaTab, setActiveFormulaTab] = useState(0);

  // Compute capacity dynamically
  const result = useMemo(() => {
    return calculateCapacity({
      dailyActiveUsers,
      peakMultiplier,
      ordersPerMin,
      avgLatencyMs,
      cpuTimePerReqMs,
      payloadSizeKb,
      targetCpuUtilization,
      cacheHitRatio,
    });
  }, [
    dailyActiveUsers,
    peakMultiplier,
    ordersPerMin,
    avgLatencyMs,
    cpuTimePerReqMs,
    payloadSizeKb,
    targetCpuUtilization,
    cacheHitRatio,
  ]);

  const { metrics, economics, cloudTiers } = result;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Calculator className="w-5 h-5" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-slate-100">
                Mathematical Cloud Capacity Requirements Sizer
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rigorous queueing theory models (Little's Law, CPU execution saturation, PgBouncer pool sizing & multi-cloud economics)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                Elastic Cloud Savings
              </span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {economics.savingsPct}% ({economics.monthlySavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/mo)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Mathematical Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Workload & SLA Parameters
            </h3>
            <span className="text-[11px] text-slate-400">Interactive Tuner</span>
          </div>

          {/* Slider 1: Daily Active Users */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Daily Active Users (DAU)</span>
              <span className="font-mono text-orange-400 font-bold">
                {(dailyActiveUsers / 1000000).toFixed(2)}M Users
              </span>
            </div>
            <input
              type="range"
              min="200000"
              max="5000000"
              step="100000"
              value={dailyActiveUsers}
              onChange={(e) => setDailyActiveUsers(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>200k</span>
              <span>1.5M (Default)</span>
              <span>5.0M</span>
            </div>
          </div>

          {/* Slider 2: Peak Dinner Multiplier */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Peak Dinner Surge Factor</span>
              <span className="font-mono text-orange-400 font-bold">{peakMultiplier}x Baseline</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.5"
              value={peakMultiplier}
              onChange={(e) => setPeakMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>2.0x (Mild)</span>
              <span>8.5x (Dinner Peak)</span>
              <span>15.0x (IPL Final)</span>
            </div>
          </div>

          {/* Slider 3: Peak Orders per Minute */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Peak Order Checkout Rate</span>
              <span className="font-mono text-orange-400 font-bold">{ordersPerMin.toLocaleString()} orders/min</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={ordersPerMin}
              onChange={(e) => setOrdersPerMin(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>1k</span>
              <span>7.5k orders/min</span>
              <span>25k orders/min</span>
            </div>
          </div>

          {/* Slider 4: Target Response Latency SLA */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Target Latency SLA (p95)</span>
              <span className="font-mono text-orange-400 font-bold">{avgLatencyMs} ms</span>
            </div>
            <input
              type="range"
              min="50"
              max="800"
              step="25"
              value={avgLatencyMs}
              onChange={(e) => setAvgLatencyMs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>50ms (Ultra-fast)</span>
              <span>150ms (Optimal)</span>
              <span>800ms (High lag)</span>
            </div>
          </div>

          {/* Slider 5: Target CPU Utilization Threshold */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Safe CPU Utilization Ceiling</span>
              <span className="font-mono text-orange-400 font-bold">{targetCpuUtilization}% Target</span>
            </div>
            <input
              type="range"
              min="40"
              max="90"
              step="5"
              value={targetCpuUtilization}
              onChange={(e) => setTargetCpuUtilization(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>40% (Over-safe)</span>
              <span>65% (Recommended)</span>
              <span>90% (Risk of Throttling)</span>
            </div>
          </div>

          {/* Slider 6: Cache Hit Ratio */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Redis Cache Hit Ratio</span>
              <span className="font-mono text-orange-400 font-bold">{cacheHitRatio}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="99"
              step="1"
              value={cacheHitRatio}
              onChange={(e) => setCacheHitRatio(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>60% (Poor Cache)</span>
              <span>90% (Healthy)</span>
              <span>99% (XFetch Active)</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-2 font-medium">Quick Workload Presets:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setDailyActiveUsers(1000000);
                  setPeakMultiplier(5.5);
                  setOrdersPerMin(4500);
                  setAvgLatencyMs(140);
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 text-center"
              >
                Standard Dinner
              </button>
              <button
                onClick={() => {
                  setDailyActiveUsers(2200000);
                  setPeakMultiplier(9.5);
                  setOrdersPerMin(9800);
                  setAvgLatencyMs(180);
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 text-center"
              >
                Friday Surge
              </button>
              <button
                onClick={() => {
                  setDailyActiveUsers(3500000);
                  setPeakMultiplier(13.0);
                  setOrdersPerMin(18000);
                  setAvgLatencyMs(260);
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 text-center"
              >
                World Cup Peak
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Capacity Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Capacity KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Little's Law Concurrency */}
            <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-950/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 block">
                Little's Law (L = λ·W)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-sky-200">
                  {metrics.littlesLawConcurrency.toLocaleString()}
                </span>
                <span className="text-[11px] text-sky-400">concurrent reqs</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                @ {metrics.peakRps.toLocaleString()} Peak RPS
              </span>
            </div>

            {/* Compute Capacity (vCPUs) */}
            <div className="p-3.5 rounded-xl border border-orange-500/30 bg-orange-950/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400 block">
                Total Compute Required
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-orange-200">
                  {metrics.totalRecommendedVcpus}
                </span>
                <span className="text-[11px] text-orange-400">vCPUs</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {metrics.podCount} Pods ({metrics.k8sNodeCount} Nodes)
              </span>
            </div>

            {/* Total Cluster RAM */}
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block">
                Cluster Memory Sizing
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-emerald-200">
                  {metrics.totalClusterRamGb}
                </span>
                <span className="text-[11px] text-emerald-400">GB RAM</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Includes 15% buffer headroom
              </span>
            </div>

            {/* Database Capacity */}
            <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 block">
                Database IOPS Load
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-purple-200">
                  {metrics.totalDbIops.toLocaleString()}
                </span>
                <span className="text-[11px] text-purple-400">IOPS</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {metrics.readIops} Read / {metrics.writeIops} Write
              </span>
            </div>

            {/* PgBouncer Pool */}
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                PgBouncer Connection Pool
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-amber-200">
                  {metrics.recommendedPgBouncerServerPool}
                </span>
                <span className="text-[11px] text-amber-400">Server Conns</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Multiplexes {metrics.unmanagedDbConnections} client conns
              </span>
            </div>

            {/* Redis Distributed Cache */}
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 block">
                Redis Cache Cluster
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-rose-200">
                  {metrics.recommendedRedisMemoryGb}
                </span>
                <span className="text-[11px] text-rose-400">GB ({metrics.redisShardCount} shards)</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                XFetch Probabilistic TTL
              </span>
            </div>
          </div>

          {/* Multi-Cloud Sizing Matrix */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              Multi-Cloud Architecture Mapping (AWS • GCP • Azure)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="pb-2">Cloud Provider</th>
                    <th className="pb-2">Compute Fleet</th>
                    <th className="pb-2">Relational Database</th>
                    <th className="pb-2">In-Memory Cache</th>
                    <th className="pb-2">Event Streaming</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-amber-400">AWS</td>
                    <td className="py-2.5">{cloudTiers.aws.compute}</td>
                    <td className="py-2.5">{cloudTiers.aws.database}</td>
                    <td className="py-2.5">{cloudTiers.aws.cache}</td>
                    <td className="py-2.5">{cloudTiers.aws.streaming}</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-sky-400">Google Cloud (GCP)</td>
                    <td className="py-2.5">{cloudTiers.gcp.compute}</td>
                    <td className="py-2.5">{cloudTiers.gcp.database}</td>
                    <td className="py-2.5">{cloudTiers.gcp.cache}</td>
                    <td className="py-2.5">{cloudTiers.gcp.streaming}</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-blue-400">Microsoft Azure</td>
                    <td className="py-2.5">{cloudTiers.azure.compute}</td>
                    <td className="py-2.5">{cloudTiers.azure.database}</td>
                    <td className="py-2.5">{cloudTiers.azure.cache}</td>
                    <td className="py-2.5">{cloudTiers.azure.streaming}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SRE Cost & Economics Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Capacity Financial Analysis: Static vs Elastic Model
              </h4>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {economics.savingsPct}% Cost Reduction
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Static Over-provisioning:</span>
                <span className="text-base font-bold text-rose-400">
                  {economics.staticMonthlyCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Runs at peak 24/7/365</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Elastic Hybrid Autoscaling:</span>
                <span className="text-base font-bold text-emerald-400">
                  {economics.dynamicMonthlyCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Pre-warmed + KEDA auto-down</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-slate-400 block text-[11px]">Net Annual Bottom-Line:</span>
                <span className="text-base font-bold text-emerald-300">
                  {(economics.monthlySavings * 12).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Annual OPEX Preserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Formulas Reference Tabs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Academic Mathematical Formulations (K5 Evaluative Proofs)
        </h3>

        <div className="flex space-x-2 border-b border-slate-800 pb-2 mb-4 overflow-x-auto no-scrollbar">
          {CAPACITY_FORMULAS_DOCS.map((doc, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFormulaTab(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeFormulaTab === idx
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {doc.name}
            </button>
          ))}
        </div>

        {/* Active Formula Card */}
        {CAPACITY_FORMULAS_DOCS[activeFormulaTab] && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-200">
                {CAPACITY_FORMULAS_DOCS[activeFormulaTab].name}
              </span>
              <div className="px-3 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-sm text-orange-400 font-bold">
                {CAPACITY_FORMULAS_DOCS[activeFormulaTab].latex}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Parameter Semantics:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {CAPACITY_FORMULAS_DOCS[activeFormulaTab].parameters.map((param, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-slate-800/80">
                    <span className="font-mono font-bold text-sky-400 min-w-[70px]">{param.sym}:</span>
                    <span className="text-slate-300">{param.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">SRE Engineering Application: </strong>
              {CAPACITY_FORMULAS_DOCS[activeFormulaTab].application}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

