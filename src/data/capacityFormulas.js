// Mathematical & Empirical Cloud Capacity Planning Formulas

/**
 * Calculates complete cloud infrastructure capacity requirements using Little's Law,
 * CPU/Memory saturation models, database connection sizing, and cloud pricing matrices.
 */
export function calculateCapacity({
  dailyActiveUsers = 1500000,
  peakMultiplier = 8.5,
  avgOrderPrepTimeSec = 180,
  ordersPerMin = 7500,
  avgLatencyMs = 150,
  cpuTimePerReqMs = 12,
  payloadSizeKb = 35,
  targetCpuUtilization = 65,
  cacheHitRatio = 88,
  microserviceFanOut = 4.2
}) {
  // 1. Throughput & Little's Law Concurrency
  // Base RPS derived from DAU (assuming 60% activity distributed across 14 active hours)
  const baseRps = Math.round((dailyActiveUsers * 0.12) / 3600);
  const peakRps = Math.round(baseRps * (peakMultiplier / 2.5));
  const totalInternalRps = Math.round(peakRps * microserviceFanOut);

  // Little's Law: L = λ * W
  // L = Concurrent active in-flight requests
  // λ = Arrival rate (requests per second)
  // W = Average response time (in seconds)
  const arrivalRateLambda = peakRps;
  const avgResponseTimeW = avgLatencyMs / 1000;
  const littlesLawConcurrency = Math.round(arrivalRateLambda * avgResponseTimeW);
  const clusterInternalConcurrency = Math.round(totalInternalRps * avgResponseTimeW);

  // 2. Compute Capacity (vCPUs & Kubernetes Pods)
  // Required CPU cores = (Total Internal RPS * CPU Time per Req in seconds) / Target Utilization
  const requiredRawCpuCores = (totalInternalRps * (cpuTimePerReqMs / 1000)) / (targetCpuUtilization / 100);
  // Add 25% safety burst headroom for unexpected surges
  const totalRecommendedVcpus = Math.ceil(requiredRawCpuCores * 1.25);
  // Standard container pod profile: 2 vCPU, 4GB RAM
  const podCount = Math.ceil(totalRecommendedVcpus / 2);
  // Number of 8-vCPU nodes needed for Kubernetes cluster
  const k8sNodeCount = Math.ceil(totalRecommendedVcpus / 7); // Leaving 1 vCPU for daemonsets/OS

  // 3. Memory Dimensioning
  // Base container heap (2GB) + active request buffers (concurrency * avg payload) + OS overhead
  const basePodMemoryGb = 4;
  const totalClusterRamGb = Math.ceil(podCount * basePodMemoryGb * 1.15);

  // 4. Network Bandwidth
  // Throughput (Gbps) = (Peak RPS * Payload Size in KB * 8 bits) / (1024 * 1024)
  const peakEgressGbps = Number(((peakRps * payloadSizeKb * 8) / (1024 * 1024)).toFixed(2));
  const cdnOffloadPct = 68; // Static assets, menu images, cached restaurant cards offloaded to CDN
  const originEgressGbps = Number((peakEgressGbps * (1 - cdnOffloadPct / 100)).toFixed(2));

  // 5. Database Capacity (PostgreSQL / Aurora)
  // Orders and State updates bypass cache (Write IOPS)
  // Search & Browse with cache misses hit DB (Read IOPS)
  const writeIops = Math.round((ordersPerMin / 60) * 18); // Each order touches carts, order, payment, ledger, rider tracking
  const cacheMissRate = 1 - (cacheHitRatio / 100);
  const readIops = Math.round(peakRps * cacheMissRate * 4.5);
  const totalDbIops = writeIops + readIops;

  // Connection Pool Math (HikariCP / PgBouncer Formula: Connections = (Core_Count * 2) + Disk_Spindles)
  // Without PgBouncer, each pod opens 20 connections => podCount * 20
  const unmanagedDbConnections = podCount * 25;
  const recommendedPgBouncerMaxClients = 1500;
  const recommendedPgBouncerServerPool = 96; // Concentrated connection pool to primary DB
  const recommendedDbReplicas = Math.ceil(readIops / 12000); // 1 replica per 12,000 Read IOPS

  // 6. Redis Distributed Cache Sizing
  // Active restaurants (50,000) * Menu data (80KB) + Active user sessions (1.5M * 4KB) + Rider coordinates
  const menuDataSizeGb = (45000 * 85) / (1024 * 1024); // ~3.6 GB
  const activeSessionsGb = (littlesLawConcurrency * 12 * 6) / 1024; // ~12 GB
  const geoRiderIndexGb = (35000 * 2) / 1024; // ~0.07 GB
  const rawCacheSizeGb = menuDataSizeGb + activeSessionsGb + geoRiderIndexGb;
  // Sized with 40% memory headroom for Redis fork snapshots (BGSAVE) and buffer churn
  const recommendedRedisMemoryGb = Math.ceil(rawCacheSizeGb * 1.45);
  const redisShardCount = Math.max(3, Math.ceil(recommendedRedisMemoryGb / 16));

  // 7. Event Streaming (Kafka / KEDA)
  // Order stream, payment webhooks, GPS pings
  const kafkaEventsPerSec = Math.round((ordersPerMin / 60) * 8 + (peakRps * 0.35));
  // A single Kafka partition comfortably handles 1,500 msgs/sec with replication factor 3
  const kafkaPartitions = Math.max(8, Math.ceil(kafkaEventsPerSec / 1200));

  // 8. Cost & SRE Economics
  // Hourly rates (approx AWS on-demand):
  // m6i.2xlarge (8 vCPU, 32GB RAM): $0.384/hr
  // Aurora PostgreSQL db.r6g.4xlarge: $2.176/hr
  // ElastiCache Redis cache.r6g.xlarge: $0.278/hr
  // Data Transfer & ALB: ~$0.08 per GB
  const computeCostPerHour = k8sNodeCount * 0.384;
  const dbCostPerHour = (1 + recommendedDbReplicas) * 1.85;
  const cacheCostPerHour = redisShardCount * 0.28;
  const egressCostPerHour = originEgressGbps * 3600 * 0.008; // GB egress
  const managedHourlyCost = Number((computeCostPerHour + dbCostPerHour + cacheCostPerHour + egressCostPerHour).toFixed(2));
  
  // Static Over-provisioning: Must run at peak capacity 24/7/365 to avoid dinner crashes
  const staticHourlyCost = Number((managedHourlyCost * 1.68).toFixed(2));
  const staticMonthlyCost = Math.round(staticHourlyCost * 24 * 30.5);
  // Dynamic Elastic Autoscaling: Scales down to 15% at night and 40% during off-peak hours
  // Average blended cost factor is ~0.42 of peak
  const dynamicMonthlyCost = Math.round(staticMonthlyCost * 0.44);
  const monthlySavings = staticMonthlyCost - dynamicMonthlyCost;
  const savingsPct = Math.round((monthlySavings / staticMonthlyCost) * 100);

  return {
    inputs: {
      dailyActiveUsers,
      peakMultiplier,
      ordersPerMin,
      avgLatencyMs,
      cpuTimePerReqMs,
      payloadSizeKb,
      targetCpuUtilization,
      cacheHitRatio,
    },
    metrics: {
      baseRps,
      peakRps,
      totalInternalRps,
      littlesLawConcurrency,
      clusterInternalConcurrency,
      totalRecommendedVcpus,
      podCount,
      k8sNodeCount,
      totalClusterRamGb,
      peakEgressGbps,
      originEgressGbps,
      writeIops,
      readIops,
      totalDbIops,
      unmanagedDbConnections,
      recommendedPgBouncerServerPool,
      recommendedPgBouncerMaxClients,
      recommendedDbReplicas,
      recommendedRedisMemoryGb,
      redisShardCount,
      kafkaEventsPerSec,
      kafkaPartitions,
    },
    economics: {
      managedHourlyCost,
      staticHourlyCost,
      staticMonthlyCost,
      dynamicMonthlyCost,
      monthlySavings,
      savingsPct,
    },
    cloudTiers: {
      aws: {
        compute: `${k8sNodeCount}x m6i.2xlarge (EKS Cluster)`,
        database: `Amazon Aurora PostgreSQL (1x Primary + ${recommendedDbReplicas}x Read Replicas db.r6g.2xlarge)`,
        cache: `Amazon ElastiCache Redis (${redisShardCount} shards, cache.r6g.large)`,
        streaming: `Amazon MSK (${Math.max(3, Math.ceil(kafkaPartitions / 6))} brokers kafka.m5.large)`,
      },
      gcp: {
        compute: `${k8sNodeCount}x e2-standard-8 (Google Kubernetes Engine)`,
        database: `Cloud SQL for PostgreSQL (High-Mem 8-vCPU + ${recommendedDbReplicas}x Replicas)`,
        cache: `Google Cloud Memorystore for Redis (${recommendedRedisMemoryGb} GB Cluster)`,
        streaming: `Google Cloud Pub/Sub with BigQuery subscription`,
      },
      azure: {
        compute: `${k8sNodeCount}x Standard_D8s_v5 (Azure Kubernetes Service)`,
        database: `Azure Database for PostgreSQL Flexible Server (${recommendedDbReplicas + 1} instances)`,
        cache: `Azure Cache for Redis Premium (${redisShardCount} shards)`,
        streaming: `Azure Event Hubs (Premium tier, ${kafkaPartitions} TU)`,
      }
    }
  };
}

export const CAPACITY_FORMULAS_DOCS = [
  {
    name: "Little's Law (Queueing Theory)",
    latex: "L = \\lambda \\times W",
    parameters: [
      { sym: "L", desc: "Average number of concurrent requests in the system" },
      { sym: "λ (Lambda)", desc: "Arrival rate of requests (Requests Per Second - RPS)" },
      { sym: "W", desc: "Mean response time / service latency (seconds)" }
    ],
    application: "Determines thread pool sizing and TCP connection backlogs. If peak arrival is 90,000 RPS and average service time is 180ms, the cloud infrastructure MUST sustain 16,200 concurrent in-flight requests simultaneously without dropping TCP SYNs."
  },
  {
    name: "vCPU Capacity Dimensioning",
    latex: "C_{\\text{req}} = \\frac{\\lambda_{\\text{total}} \\times T_{\\text{cpu}}}{U_{\\text{target}}} \\times S_{\\text{burst}}",
    parameters: [
      { sym: "C_req", desc: "Required dedicated virtual CPU cores" },
      { sym: "λ_total", desc: "Aggregated internal RPC arrival rate including microservice fan-out" },
      { sym: "T_cpu", desc: "Active CPU execution time spent per request (excluding I/O wait)" },
      { sym: "U_target", desc: "Target sustained CPU utilization threshold (typically 0.60 to 0.70)" },
      { sym: "S_burst", desc: "Safety multiplier for unexpected viral spikes (1.20 to 1.35)" }
    ],
    application: "Prevents CPU throttling (CFS quota pauses in Kubernetes) which causes exponential tail latency (p99) degradation during sudden peak transitions."
  },
  {
    name: "Database Connection Pool Sizing (HikariCP / PgBouncer)",
    latex: "N_{\\text{connections}} = (C_{\\text{db\\_cores}} \\times 2) + D_{\\text{spindles/IOPS\\_factor}}",
    parameters: [
      { sym: "N_connections", desc: "Optimal active connection pool size to PostgreSQL instance" },
      { sym: "C_db_cores", desc: "Number of physical/virtual CPU cores allocated to database" },
      { sym: "D_factor", desc: "Effective concurrent disk I/O spindle / NVMe channel factor (typically 4-8)" }
    ],
    application: "Directly solves the primary failure cause: 100+ microservice pods each opening 25 connections will spawn 2,500 backend OS threads, overwhelming PostgreSQL context switches. PgBouncer multiplexes 2,500 client connections into a tight pool of 64-96 server connections."
  },
  {
    name: "Probabilistic Early Expiration (XFetch Algorithm)",
    latex: "\\text{Trigger} = (-\\beta \\times \\delta \\times \\ln(rand())) > (\\text{TTL} - \\text{now})",
    parameters: [
      { sym: "β (Beta)", desc: "Aggressiveness parameter (> 0, default 1.0)" },
      { sym: "δ (Delta)", desc: "Computation time required to recompute the cache value" },
      { sym: "rand()", desc: "Uniform pseudo-random number between 0 and 1" },
      { sym: "TTL - now", desc: "Remaining time before cache key expires" }
    ],
    application: "Eliminates the 'Thundering Herd' / Cache Stampede. As popular restaurant menu items near expiration, exactly ONE background worker recomputes the menu ahead of time, while all other dinner customers continue receiving instant cached reads."
  }
];

