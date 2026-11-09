import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Database, 
  Clock, 
  DollarSign, 
  Layers, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import ArchitectureTopology from '../components/ArchitectureTopology';
import StatCard from '../components/StatCard';
import { BENCHMARK_SCENARIOS } from '../data/workloadData';

export default function Tab2Simulator({ simMode, setSimMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(6); // 18:00 to 22:00 in 15-min increments (Step 0 to 16)
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('friday');
  const [injectedFault, setInjectedFault] = useState(null);

  const timerRef = useRef(null);

  // Time steps from 18:00 to 22:00 (17 data points, step = 15 mins)
  const timeSteps = [
    { time: "18:00", label: "18:00 Early Dinner", baseRps: 42000, surge: 1.0 },
    { time: "18:15", label: "18:15 Early Browse", baseRps: 48000, surge: 1.15 },
    { time: "18:30", label: "18:30 Pre-warming Target", baseRps: 56000, surge: 1.35 },
    { time: "18:45", label: "18:45 Commute Home", baseRps: 64000, surge: 1.55 },
    { time: "19:00", label: "19:00 Dinner Ramp", baseRps: 74000, surge: 1.8 },
    { time: "19:15", label: "19:15 Surge Wave 1", baseRps: 84000, surge: 2.1 },
    { time: "19:30", label: "19:30 Rapid Peak Spike", baseRps: 96000, surge: 2.4 },
    { time: "19:45", label: "19:45 Cache Expiration", baseRps: 104000, surge: 2.65 },
    { time: "20:00", label: "20:00 CRITICAL PEAK", baseRps: 108000, surge: 2.8 },
    { time: "20:15", label: "20:15 Sustained Peak", baseRps: 105000, surge: 2.7 },
    { time: "20:30", label: "20:30 Retry Storm Peak", baseRps: 101000, surge: 2.55 },
    { time: "20:45", label: "20:45 Late Dinner Wave", baseRps: 94000, surge: 2.3 },
    { time: "21:00", label: "21:00 Peak Tapering", baseRps: 82000, surge: 2.0 },
    { time: "21:15", label: "21:15 Late Orders", baseRps: 68000, surge: 1.6 },
    { time: "21:30", label: "21:30 Dessert & Snacks", baseRps: 52000, surge: 1.25 },
    { time: "21:45", label: "21:45 Night Settling", baseRps: 38000, surge: 0.9 },
    { time: "22:00", label: "22:00 Midnight Baseline", baseRps: 24000, surge: 0.6 },
  ];

  const scenario = BENCHMARK_SCENARIOS[selectedScenario];
  const isManaged = simMode === 'managed';

  // Calculate live dynamic metrics for current step
  const activeStepData = timeSteps[currentStep];
  const rawRps = Math.round(activeStepData.baseRps * (scenario.multiplier / 6.0));
  const activeRps = injectedFault === 'monsoon' ? Math.round(rawRps * 1.35) : rawRps;

  // Compute unmanaged vs managed telemetry
  const unmanagedCpu = Math.min(100, Math.round(40 + (activeRps / 110000) * 60 + (injectedFault ? 15 : 0)));
  const managedCpu = Math.min(75, Math.max(35, Math.round(35 + (activeRps / 160000) * 35)));

  const unmanagedLatency = activeRps > 75000 || injectedFault 
    ? Math.round(350 + Math.pow((activeRps - 60000) / 4500, 2) * 45 + (injectedFault === 'payment_lag' ? 3200 : 0))
    : Math.round(120 + (activeRps / 10000) * 12);

  const managedLatency = injectedFault === 'payment_lag'
    ? 240 // Circuit breaker isolates slow payment gateway
    : Math.round(110 + (activeRps / 110000) * 65);

  const unmanagedErrorRate = activeRps > 75000 || injectedFault
    ? Number(Math.min(68, Math.max(0.5, ((activeRps - 65000) / 1000) * 0.95 + (injectedFault ? 18 : 0))).toFixed(1))
    : 0.05;

  const managedErrorRate = injectedFault === 'monsoon' 
    ? 0.12 
    : (injectedFault === 'payment_lag' ? 0.08 : 0.03);

  const unmanagedPods = Math.min(60, Math.max(24, Math.round(24 + (activeRps / 110000) * 32))); // reactive lag
  const managedPods = Math.min(140, Math.max(48, Math.round(48 + (activeRps / 110000) * 75))); // pre-warmed & fast-scaled

  // Simulation step timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= timeSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, timeSteps.length]);

  // Generate historical simulation charts data up to current step
  const timelineChartData = timeSteps.map((step, idx) => {
    const stepRps = Math.round(step.baseRps * (scenario.multiplier / 6.0));
    const stepUnmanagedLat = stepRps > 75000
      ? Math.round(350 + Math.pow((stepRps - 60000) / 4500, 2) * 45)
      : Math.round(120 + (stepRps / 10000) * 12);
    const stepManagedLat = Math.round(110 + (stepRps / 110000) * 65);

    const stepUnmanagedErr = stepRps > 75000 
      ? Number(Math.min(65, ((stepRps - 65000) / 1000) * 0.95).toFixed(1))
      : 0.05;
    const stepManagedErr = 0.04;

    return {
      time: step.time,
      rps: stepRps,
      unmanagedLatency: stepUnmanagedLat,
      managedLatency: stepManagedLat,
      unmanagedErrorRate: stepUnmanagedErr,
      managedErrorRate: stepManagedErr,
      active: idx <= currentStep,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Scenario Selector & Title */}
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-base md:text-lg font-bold text-slate-100">
                Live Peak Dinner Workload Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate traffic step-by-step from 18:00 to 22:00. Compare Baseline vs Managed Controls.
            </p>
          </div>

          {/* Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Scenario:</span>
            {Object.values(BENCHMARK_SCENARIOS).map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenario(sc.id);
                  setCurrentStep(6);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                  selectedScenario === sc.id
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-700'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs"
              title="Previous 15 mins"
            >
              -15m
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(timeSteps.length - 1, currentStep + 1))}
              disabled={currentStep === timeSteps.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs"
              title="Next 15 mins"
            >
              +15m
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(0);
                setInjectedFault(null);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 pl-2 border-l border-slate-800 text-xs">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded font-mono font-bold ${
                    playbackSpeed === spd
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrubbing Slider Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span className="text-slate-400">
              Active Simulation Clock: <strong className="text-orange-400 text-sm">{activeStepData.time} hrs</strong>
            </span>
            <span className="text-slate-400">
              Arrival Rate: <strong className="text-slate-200">{activeRps.toLocaleString()} RPS</strong>
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={timeSteps.length - 1}
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStep(Number(e.target.value));
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            {timeSteps.filter((_, i) => i % 2 === 0).map((s, idx) => (
              <span key={idx}>{s.time}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Live Telemetry KPI Cards comparing Unmanaged vs Managed */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Request Rate */}
        <StatCard
          label="Active Request Load"
          value={activeRps.toLocaleString()}
          unit="RPS"
          icon={Activity}
          status="default"
          subtext={`Phase: ${activeStepData.label}`}
        />

        {/* Metric 2: Latency */}
        <StatCard
          label="Tail Latency (p99)"
          value={isManaged ? managedLatency : unmanagedLatency}
          unit="ms"
          icon={Clock}
          status={isManaged ? 'success' : (unmanagedLatency > 1000 ? 'danger' : 'warning')}
          trend={isManaged ? 'SLA Maintained' : 'Timeout Spike'}
          trendPositive={isManaged}
          subtext={isManaged ? 'Target SLA: <180ms' : 'Unmanaged: 504 Timeout'}
        />

        {/* Metric 3: Error Rate */}
        <StatCard
          label="Failed Requests (5xx)"
          value={isManaged ? `${managedErrorRate}%` : `${unmanagedErrorRate}%`}
          unit="Error Rate"
          icon={isManaged ? ShieldCheck : Flame}
          status={isManaged ? 'success' : (unmanagedErrorRate > 5 ? 'danger' : 'warning')}
          trend={isManaged ? '0.03% (Resilient)' : `${unmanagedErrorRate}% Errors`}
          trendPositive={isManaged}
          subtext={isManaged ? 'Kafka Asynchronous Ingestion' : 'DB Pool Starvation'}
        />

        {/* Metric 4: Active Pod Fleet */}
        <StatCard
          label="Kubernetes Pods"
          value={isManaged ? managedPods : unmanagedPods}
          unit="Active Pods"
          icon={Cpu}
          status={isManaged ? 'info' : 'warning'}
          trend={isManaged ? 'Pre-warmed at 18:30' : 'Lagging (Reactive)'}
          trendPositive={isManaged}
          subtext={isManaged ? 'KEDA Event-driven scaled' : 'Cold boot wait'}
        />
      </div>

      {/* Live Architecture Topology Canvas */}
      <ArchitectureTopology 
        simMode={simMode}
        activeRps={activeRps}
        injectedFault={injectedFault}
        onInjectFault={setInjectedFault}
      />

      {/* Comparative Real-Time Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Comparison Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Response Latency (p99) Curve
              </h3>
              <p className="text-[11px] text-slate-400">Baseline (Red) vs Recommended Controls (Emerald)</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Milliseconds (ms)</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineChartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="unmanagedLatency" 
                  name="Baseline (Unmanaged)" 
                  stroke="#f43f5e" 
                  strokeWidth={2.5} 
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="managedLatency" 
                  name="Managed (Controls Active)" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Rate Comparison Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                HTTP 5xx Error Rate Percentage (%)
              </h3>
              <p className="text-[11px] text-slate-400">Failures Spike to 40%+ under Unmanaged Load</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Percentage (%)</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineChartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="unmanagedErrorRate" 
                  name="Baseline Error %" 
                  stroke="#f43f5e" 
                  strokeWidth={2.5} 
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="managedErrorRate" 
                  name="Managed Error %" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
