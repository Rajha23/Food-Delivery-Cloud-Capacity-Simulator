import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  ArrowRight, 
  RotateCcw,
  Activity,
  Layers,
  Cpu,
  Clock,
  Radio,
  Flame
} from 'lucide-react';

export default function ArchitectureTopology({ 
  simMode = 'unmanaged', 
  activeRps = 108000,
  injectedFault = null,
  onInjectFault = () => {} 
}) {
  const [selectedNode, setSelectedNode] = useState(null);

  const isManaged = simMode === 'managed';

  // Derived state based on mode and active faults
  const isCacheStampede = !isManaged && (injectedFault === 'cache_stampede' || activeRps > 70000);
  const isDbOverloaded = !isManaged && (injectedFault === 'db_exhaustion' || activeRps > 65000);
  const isPaymentLag = injectedFault === 'payment_lag' || (activeRps > 90000);
  const isMonsoon = injectedFault === 'monsoon';

  const nodes = [
    {
      id: 'cdn',
      name: 'Cloudflare / Edge CDN',
      type: 'edge',
      x: 100,
      y: 80,
      status: 'healthy',
      latency: isManaged ? '18ms' : '45ms',
      detail: isManaged 
        ? 'Edge caching static menu images, geofenced DNS routing, virtual waiting room standby.' 
        : 'Static asset delivery; no dynamic queueing or early DDoS throttling.'
    },
    {
      id: 'gateway',
      name: 'API Gateway & Ingress',
      type: 'gateway',
      x: 320,
      y: 80,
      status: !isManaged && activeRps > 85000 ? 'critical' : 'healthy',
      latency: isManaged ? '24ms' : '980ms',
      alert: !isManaged && activeRps > 85000 ? 'HTTP 504 Gateway Timeouts' : null,
      detail: isManaged 
        ? 'Envoy Token Bucket rate limiting: 2-tier protection shedding bot scrapers.' 
        : 'Unthrottled ingress gateway forwarding synchronous requests directly to backend.'
    },
    {
      id: 'search',
      name: 'Search & Catalog Pods',
      type: 'service',
      x: 560,
      y: 40,
      pods: isManaged ? '48 pods (Pre-warmed)' : '18 pods (Cold Scale Lag)',
      status: isCacheStampede ? 'critical' : (isManaged ? 'healthy' : 'warning'),
      alert: isCacheStampede ? 'Cache Miss Stampede' : null,
      detail: isManaged 
        ? 'Redis XFetch probabilistic renewal; zero thundering herd.' 
        : 'Synchronous menu queries bypass expired Redis keys, flooding Postgres.'
    },
    {
      id: 'cart',
      name: 'Cart & Surge Pricing',
      type: 'service',
      x: 560,
      y: 110,
      pods: isManaged ? '36 pods' : '12 pods',
      status: isManaged ? 'healthy' : 'warning',
      detail: isManaged 
        ? 'Optimistic concurrency on carts; pre-calculated regional surge tiers.' 
        : 'Row-level lock contention on promotional coupon database.'
    },
    {
      id: 'checkout',
      name: 'Checkout & Orchestrator',
      type: 'service',
      x: 560,
      y: 180,
      pods: isManaged ? '52 pods' : '22 pods',
      status: (!isManaged && (isPaymentLag || activeRps > 75000)) ? 'critical' : 'healthy',
      alert: (!isManaged && isPaymentLag) ? 'Thread Pool Starvation' : (isManaged && isPaymentLag ? 'Circuit Breaker: HALF-OPEN (Fallback Active)' : null),
      detail: isManaged 
        ? 'Resilience4j Circuit Breaker + Kafka Async Order ingestion (10ms commit).' 
        : 'Synchronously holds HTTP threads waiting for payment gateways and DB locks.'
    },
    {
      id: 'dispatch',
      name: 'Rider Geo-Dispatch',
      type: 'service',
      x: 560,
      y: 250,
      pods: isManaged ? '40 pods' : '14 pods',
      status: isMonsoon && !isManaged ? 'critical' : 'healthy',
      alert: isMonsoon && !isManaged ? 'Driver Deficit Spike (ETA 55m)' : null,
      detail: isManaged 
        ? 'Kafka Geo-partitioned streams + Redis geospatial indexes.' 
        : 'Direct PostGIS spatial query writes creating lock cascades.'
    },
    {
      id: 'redis',
      name: 'Redis 7.2 Cluster',
      type: 'cache',
      x: 810,
      y: 50,
      status: isCacheStampede ? 'warning' : 'healthy',
      metric: isManaged ? '96.4% Hit Ratio' : '48.2% Hit Ratio (Stampede)',
      detail: isManaged 
        ? '3-shard cluster with XFetch algorithm and LRU memory eviction.' 
        : 'Deterministic TTL expiration causes synchronized mass key eviction at 19:30.'
    },
    {
      id: 'kafka',
      name: 'Apache Kafka / KEDA',
      type: 'queue',
      x: 810,
      y: 150,
      status: 'healthy',
      metric: isManaged ? 'Buffer Lag: 28 ms' : 'Disabled (Direct DB Write)',
      detail: isManaged 
        ? 'Topic partitions handle 12,000 orders/sec asynchronously; triggers KEDA autoscaling.' 
        : 'Not utilized in legacy synchronous architecture.'
    },
    {
      id: 'postgres',
      name: 'Aurora PostgreSQL Primary',
      type: 'database',
      x: 810,
      y: 250,
      status: isDbOverloaded ? 'critical' : (isManaged ? 'healthy' : 'warning'),
      alert: isDbOverloaded ? 'FATAL: Max Connections (500/500)' : null,
      metric: isManaged ? 'Pool: 64 Conns (PgBouncer)' : 'Pool: 500/500 (EXHAUSTED)',
      detail: isManaged 
        ? 'PgBouncer multiplexes 2,500 client connections into 64 backend server connections.' 
        : 'Direct connection from 120 pods exhausts max_connections (500).'
    },
    {
      id: 'payment_gateway',
      name: 'External Payment Gateway',
      type: 'external',
      x: 810,
      y: 340,
      status: isPaymentLag ? 'warning' : 'healthy',
      metric: isPaymentLag ? 'Latency: 4,800 ms (Peak Slowness)' : 'Latency: 280 ms',
      detail: isManaged 
        ? 'Protected by Circuit Breaker. If latency >2.5s, fast-fails to backup payment rails.' 
        : 'Unshielded external dependency blocks caller threads until gateway times out.'
    }
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Microservice Architecture & Live Packet Mesh
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                isManaged 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {isManaged ? 'Operational Controls ACTIVE' : 'Baseline (Vulnerable)'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive cloud topology showing live request propagation, bottleneck emergence, and control defenses
            </p>
          </div>
        </div>

        {/* Fault Injection Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
            Chaos Injection:
          </span>
          <button
            onClick={() => onInjectFault(injectedFault === 'cache_stampede' ? null : 'cache_stampede')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition border flex items-center gap-1 ${
              injectedFault === 'cache_stampede'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3 h-3 text-orange-400" />
            Menu Stampede
          </button>

          <button
            onClick={() => onInjectFault(injectedFault === 'db_exhaustion' ? null : 'db_exhaustion')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition border flex items-center gap-1 ${
              injectedFault === 'db_exhaustion'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Database className="w-3 h-3 text-rose-400" />
            Saturate DB Pool
          </button>

          <button
            onClick={() => onInjectFault(injectedFault === 'payment_lag' ? null : 'payment_lag')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition border flex items-center gap-1 ${
              injectedFault === 'payment_lag'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            Slow Payment (5s)
          </button>

          <button
            onClick={() => onInjectFault(injectedFault === 'monsoon' ? null : 'monsoon')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition border flex items-center gap-1 ${
              injectedFault === 'monsoon'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Radio className="w-3 h-3 text-sky-400" />
            Monsoon Surge
          </button>

          {injectedFault && (
            <button
              onClick={() => onInjectFault(null)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
              title="Reset Chaos Injections"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* SVG Topology Canvas */}
      <div className="relative bg-slate-950 p-6 overflow-x-auto min-h-[460px]">
        {/* Active Chaos Banner */}
        {injectedFault && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>
                <strong>CHAOS EXPERIMENT ACTIVE:</strong>{' '}
                {injectedFault === 'cache_stampede' && '50 top restaurant menus expired simultaneously. Simulating thundering herd query wave.'}
                {injectedFault === 'db_exhaustion' && 'Direct connections saturated PostgreSQL max_connections (500/500).'}
                {injectedFault === 'payment_lag' && 'External payment provider latency elevated to 4,800ms.'}
                {injectedFault === 'monsoon' && 'Flash deluge in top metro cities (+350% order volume with 40% fewer active riders).'}
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold">
              {isManaged ? '🛡️ CONTROLS ABSORBING IMPACT' : '💥 CASCADING FAILURE INDUCED'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {/* Column 1: Ingress & Edge */}
          <div className="space-y-4 flex flex-col justify-center">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
              Tier 1: Edge & Ingress
            </h4>

            {/* Edge CDN */}
            <div 
              onClick={() => setSelectedNode(nodes[0])}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                nodes[0].status === 'healthy' 
                  ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700' 
                  : 'border-rose-500/60 bg-rose-950/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Cloudflare Edge CDN</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-slate-400">Static menu images & WAF</p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
                <span>Latency: {nodes[0].latency}</span>
                <span className="text-emerald-400">99.99% Up</span>
              </div>
            </div>

            {/* API Gateway */}
            <div 
              onClick={() => setSelectedNode(nodes[1])}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                nodes[1].status === 'critical' 
                  ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-900/30' 
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">API Gateway (Kong/Envoy)</span>
                <span className={`w-2 h-2 rounded-full ${nodes[1].status === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
              </div>
              <p className="text-[11px] text-slate-400">SSL, Auth, Rate Limiter</p>
              {nodes[1].alert && (
                <div className="mt-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/60">
                  ⚠️ {nodes[1].alert}
                </div>
              )}
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
                <span>Latency: {nodes[1].latency}</span>
                <span className={nodes[1].status === 'critical' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {activeRps.toLocaleString()} RPS
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Microservices Layer */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
              Tier 2: Business Microservices (Kubernetes Cluster)
            </h4>

            {/* Microservice 1: Search */}
            <div 
              onClick={() => setSelectedNode(nodes[2])}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                nodes[2].status === 'critical' 
                  ? 'border-rose-500 bg-rose-950/40 shadow-md shadow-rose-950' 
                  : (nodes[2].status === 'warning' ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-800 bg-slate-900/80 hover:border-slate-700')
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-800 text-slate-300">
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200">Restaurant Search & Catalog</span>
                    <span className="text-[10px] text-slate-400 block">{nodes[2].pods}</span>
                  </div>
                </div>
                {nodes[2].alert ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono font-bold border border-rose-500/40">
                    {nodes[2].alert}
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                    Healthy
                  </span>
                )}
              </div>
            </div>

            {/* Microservice 2: Cart */}
            <div 
              onClick={() => setSelectedNode(nodes[3])}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                nodes[3].status === 'warning' ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-800 text-slate-300">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200">Cart & Surge Pricing</span>
                    <span className="text-[10px] text-slate-400 block">{nodes[3].pods}</span>
                  </div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {isManaged ? 'Surge: 1.4x (Pre-computed)' : 'Surge: Lock Contention'}
                </span>
              </div>
            </div>

            {/* Microservice 3: Checkout */}
            <div 
              onClick={() => setSelectedNode(nodes[4])}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                nodes[4].status === 'critical' 
                  ? 'border-rose-500 bg-rose-950/40 shadow-md shadow-rose-950' 
                  : (nodes[4].status === 'warning' ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800 bg-slate-900/80 hover:border-slate-700')
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-800 text-slate-300">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200">Checkout & Order Orchestrator</span>
                    <span className="text-[10px] text-slate-400 block">{nodes[4].pods}</span>
                  </div>
                </div>
                {nodes[4].alert ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/40">
                    {nodes[4].alert}
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                    {isManaged ? 'Async Ingestion' : 'Synchronous'}
                  </span>
                )}
              </div>
            </div>

            {/* Microservice 4: Dispatch */}
            <div 
              onClick={() => setSelectedNode(nodes[5])}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                nodes[5].status === 'critical' 
                  ? 'border-rose-500 bg-rose-950/40' 
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-800 text-slate-300">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200">Rider Dispatch & Geo-Tracking</span>
                    <span className="text-[10px] text-slate-400 block">{nodes[5].pods}</span>
                  </div>
                </div>
                {nodes[5].alert ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono font-bold">
                    {nodes[5].alert}
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {isManaged ? 'Kafka Geo-partitioned' : 'PostGIS Write Locks'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Data & Messaging Tier */}
          <div className="space-y-3 flex flex-col justify-center">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
              Tier 3: Data & Asynchronous Tier
            </h4>

            {/* Redis Cache */}
            <div 
              onClick={() => setSelectedNode(nodes[6])}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                nodes[6].status === 'warning' ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">{nodes[6].name}</span>
                <span className="text-[10px] font-mono text-orange-400 font-semibold">{isManaged ? 'XFetch On' : 'Standard TTL'}</span>
              </div>
              <p className="text-[10px] text-slate-400">{nodes[6].metric}</p>
            </div>

            {/* Kafka Broker */}
            <div 
              onClick={() => setSelectedNode(nodes[7])}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                isManaged ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-slate-800 bg-slate-900/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">{nodes[7].name}</span>
                <span className="text-[10px] font-mono text-sky-400">{isManaged ? '16 Partitions' : 'Bypassed'}</span>
              </div>
              <p className="text-[10px] text-slate-400">{nodes[7].metric}</p>
            </div>

            {/* PostgreSQL Aurora */}
            <div 
              onClick={() => setSelectedNode(nodes[8])}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                nodes[8].status === 'critical' 
                  ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-900/30' 
                  : (isManaged ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/80')
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Aurora PostgreSQL</span>
                <span className={`w-2 h-2 rounded-full ${nodes[8].status === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
              </div>
              {nodes[8].alert && (
                <div className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/70 px-1 py-0.5 rounded border border-rose-800/60 my-1">
                  💥 {nodes[8].alert}
                </div>
              )}
              <p className="text-[10px] text-slate-400 font-mono">{nodes[8].metric}</p>
            </div>

            {/* Payment Gateway External */}
            <div 
              onClick={() => setSelectedNode(nodes[9])}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                nodes[9].status === 'warning' ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-800 bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Razorpay / Stripe PSP</span>
                <span className="text-[10px] font-mono text-slate-400">External</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{nodes[9].metric}</p>
            </div>
          </div>
        </div>

        {/* Node Detail Inspector Drawer */}
        {selectedNode && (
          <div className="mt-5 p-4 rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
            >
              ✕ Close
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-orange-400">{selectedNode.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {selectedNode.type.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3">{selectedNode.detail}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block">Current Status:</span>
                <span className={selectedNode.status === 'critical' ? 'text-rose-400 font-bold' : (selectedNode.status === 'warning' ? 'text-amber-400' : 'text-emerald-400')}>
                  {selectedNode.status.toUpperCase()}
                </span>
              </div>
              {selectedNode.latency && (
                <div>
                  <span className="text-slate-500 block">Response Time:</span>
                  <span className="text-slate-200">{selectedNode.latency}</span>
                </div>
              )}
              {selectedNode.pods && (
                <div>
                  <span className="text-slate-500 block">Pod Allocation:</span>
                  <span className="text-slate-200">{selectedNode.pods}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 block">Operational Guard:</span>
                <span className="text-slate-200">{isManaged ? 'ACTIVE' : 'NONE (BASELINE)'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
