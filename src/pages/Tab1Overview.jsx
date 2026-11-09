import React from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Server, 
  Database, 
  ShieldAlert, 
  Zap, 
  Clock, 
  DollarSign, 
  Activity, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Users
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { HOURLY_WORKLOAD_PROFILE, INCIDENT_TIMELINE } from '../data/workloadData';
import StatCard from '../components/StatCard';

export default function Tab1Overview({ onNavigateToSimulator }) {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-950 p-6 md:p-8 backdrop-blur-md">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Post-Mortem Incident #INC-2026-1109
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Severity: P0 Outage
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20">
              K5 CO3 Cloud Case Study
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            The Peak Dinner Crisis: Workload Pattern Failure & Cloud Capacity Analysis
          </h2>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            During Friday dinner peak hours (19:30 – 21:30), our cloud infrastructure experienced severe 
            cascading failures: <strong>HTTP 504 Gateway Timeouts</strong>, database connection starvation, 
            and thread pool exhaustion. Over <strong className="text-rose-400">38,500 customer checkouts failed</strong>, 
            resulting in an estimated <strong className="text-rose-400">$420,000 GMV loss</strong> within 90 minutes. 
            This case study provides rigorous capacity modeling and an end-to-end operational control framework.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Users className="w-4 h-4 text-orange-400" />
              <span>Project Author: <strong>VIJAYA RAJHA K (814724104167)</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Users className="w-4 h-4 text-orange-400" />
              <span>Co-Author: <strong>VISHVAA M (814724104174)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Blast Radius Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Peak Requests Arrival"
          value="108,000"
          unit="RPS"
          icon={Activity}
          status="warning"
          trend="8.8x Surge"
          trendPositive={false}
          subtext="Normal off-peak: 12,200 RPS"
        />
        <StatCard
          label="Peak Error Rate"
          value="38.2%"
          unit="HTTP 5xx"
          icon={ShieldAlert}
          status="danger"
          trend="+3,720% vs SLA"
          trendPositive={false}
          subtext="SLO Target: < 0.05%"
        />
        <StatCard
          label="Tail Latency (p99)"
          value="5,200"
          unit="ms"
          icon={Clock}
          status="danger"
          trend="43x Degradation"
          trendPositive={false}
          subtext="Target SLA: < 150 ms"
        />
        <StatCard
          label="Direct Financial Loss"
          value="$420,000"
          unit="USD"
          icon={DollarSign}
          status="danger"
          trend="38.5k Orders Abandoned"
          trendPositive={false}
          subtext="Plus merchant churn & promo penalties"
        />
      </div>

      {/* 24-Hour Workload Diurnal Pattern Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              24-Hour Diurnal Workload Curve: Food-Delivery Platform
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrating the extreme 9.0x dinner surge peak between 19:00 and 22:00 vs flat baseline
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-orange-400">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Requests / Sec (RPS)
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_WORKLOAD_PROFILE} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="rpsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090d16', 
                  borderColor: '#334155', 
                  borderRadius: '8px', 
                  fontSize: '12px' 
                }}
                formatter={(val, name) => [`${val.toLocaleString()} RPS`, 'Arrival Rate']}
                labelFormatter={(label) => `Time: ${label}:00 hrs`}
              />
              <Area 
                type="monotone" 
                dataKey="rps" 
                stroke="#f97316" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#rpsGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-500 block">Baseline Morning Load (02:00 - 06:00):</span>
            <span className="text-slate-300 font-semibold">1,200 – 4,800 RPS (Low)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Lunch Ramp (12:00 - 14:00):</span>
            <span className="text-slate-300 font-semibold">46,000 – 52,000 RPS (4.3x Peak)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Dinner Crisis Window (19:00 - 21:30):</span>
            <span className="text-orange-400 font-bold">74,000 – 108,000 RPS (9.0x Peak)</span>
          </div>
        </div>
      </div>

      {/* Root Cause Analysis (Fishbone / Ishikawa Anatomy) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-rose-400" />
          Root Cause Anatomy: Why the Platform Collapsed
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cause 1: Auto-scaling lag */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
              <Server className="w-4 h-4" /> 1. Reactive Scaling Lag
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard HPA waits for CPU to cross 80%. When the 19:30 rush arrived in a 90-second step surge, 
              new pods took <strong>5 minutes to pull container images, bootstrap Spring runtimes, and warm JVMs</strong>. 
              By the time new pods were Ready, existing pods were already dead from thread starvation.
            </p>
          </div>

          {/* Cause 2: Database Connection Exhaustion */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
              <Database className="w-4 h-4" /> 2. Connection Pool Starvation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Without an intermediate connection pooler (PgBouncer), 120 autoscaled microservice pods each 
              opened 25 connections to PostgreSQL. This hit <strong>max_connections = 500</strong> within seconds, 
              instantly rejecting new checkout queries with fatal errors.
            </p>
          </div>

          {/* Cause 3: Cache Stampede */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
              <Zap className="w-4 h-4" /> 3. Cache Thundering Herd
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Menus for the top 50 restaurants in the city shared a synchronized 30-minute TTL that expired 
              at exactly 19:30. Over <strong>15,000 concurrent browsing customers simultaneously bypassed Redis</strong>, 
              dog-piling on the primary PostgreSQL database to re-render menus.
            </p>
          </div>

          {/* Cause 4: Lack of Circuit Breakers */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
              <ShieldAlert className="w-4 h-4" /> 4. Cascading Payment Delay
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              External payment gateways experienced high latency (4.5s). The Checkout Service held HTTP worker 
              threads open synchronously waiting for PSP callbacks. Without <strong>Circuit Breakers</strong>, all 
              worker threads locked up, cascading 504 timeouts back to the gateway.
            </p>
          </div>
        </div>
      </div>

      {/* Incident Progression Timeline */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-sky-400" />
          Chronological Incident Timeline (18:45 – 21:15)
        </h3>

        <div className="space-y-4">
          {INCIDENT_TIMELINE.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 relative pb-4 border-b border-slate-800/60 last:border-0 last:pb-0">
              <div className="w-14 font-mono text-xs font-bold text-orange-400 pt-0.5">
                {item.time}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{item.title}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded font-mono ${
                    item.status === 'healthy' 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : (item.status === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300 font-bold')
                  }`}>
                    {item.phase}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">({item.rps})</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-1">
                  <span>CPU: <strong className={item.metrics.cpu > 80 ? 'text-rose-400' : 'text-slate-300'}>{item.metrics.cpu}%</strong></span>
                  <span>Latency: <strong className={item.metrics.latency > 500 ? 'text-rose-400' : 'text-slate-300'}>{item.metrics.latency}ms</strong></span>
                  <span>5xx Errors: <strong className={item.metrics.errorRate > 1 ? 'text-rose-400' : 'text-slate-300'}>{item.metrics.errorRate}%</strong></span>
                  <span>DB Pool: <strong className={item.metrics.dbPool > 80 ? 'text-rose-400' : 'text-slate-300'}>{item.metrics.dbPool}%</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Footer */}
      <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Next Step: Test & Verify with the Interactive Simulator
          </h4>
          <p className="text-xs text-slate-400">
            Compare the baseline architecture side-by-side with our proposed 4-pillar operational management controls.
          </p>
        </div>
        <button
          onClick={onNavigateToSimulator}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white transition shadow-lg shadow-orange-500/20 whitespace-nowrap"
        >
          <span>Launch Live Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

