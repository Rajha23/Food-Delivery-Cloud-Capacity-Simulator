// Operational Management Controls, Policies, and Manifests

export const OPERATIONAL_PILLARS = [
  {
    id: "elasticity",
    title: "1. Predictive & Multi-Dimensional Elasticity",
    badge: "Scale Management",
    color: "blue",
    summary: "Replaces slow, reactive CPU-only autoscaling with proactive scheduled pre-warming and event-driven queue metrics (KEDA).",
    problemAddressed: "Reactive HPA takes 4-7 minutes to launch, pull images, and warm JVMs, resulting in 504 timeouts during the first 20 minutes of the dinner rush.",
    controls: [
      {
        name: "Scheduled Pre-Warming (Predictive Scaling)",
        description: "Automated cron schedule ramps cluster pod replicas from 24 to 90 at 18:30 (30 minutes prior to dinner peak), completely absorbing the initial surge with zero cold-start lag.",
        tooling: "Kubernetes CronJob / AWS Auto Scaling Scheduled Actions",
      },
      {
        name: "KEDA Event-Driven Scaling (Queue-Lag Trigger)",
        description: "Instead of waiting for CPU to spike to 80%, KEDA monitors Kafka topic lag (`order-creation-stream`) and scales checkout pods proportionally before CPU saturation occurs.",
        tooling: "KEDA (Kubernetes Event-driven Autoscaling) v2.14",
      },
      {
        name: "Fast-Boot Container Architecture",
        description: "Container images optimized with Alpine bases, Spring Native / Go binaries, pre-warmed connection pools, and readiness probes with initialDelaySeconds tuned to under 4s.",
        tooling: "GraalVM Native Image / Distroless Containers",
      }
    ],
    codeSnippet: {
      title: "keda-kafka-scaledobject.yaml",
      language: "yaml",
      code: `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: order-orchestrator-keda-scaler
  namespace: food-delivery-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-orchestrator
  minReplicaCount: 24
  maxReplicaCount: 160
  cooldownPeriod: 300
  advanced:
    horizontalPodAutoscalerConfig:
      behavior:
        scaleUp:
          stabilizationWindowSeconds: 0
          policies:
          - type: Percent
            value: 100 # Double pods every 15s during extreme dinner surge
            periodSeconds: 15
        scaleDown:
          stabilizationWindowSeconds: 600 # 10 min hold-down to prevent thrashing
  triggers:
  - type: kafka
    metadata:
      bootstrapServers: msk-cluster.internal:9092
      consumerGroup: order-checkout-group
      topic: dinner-orders-stream
      lagThreshold: "50" # Scale 1 pod per 50 pending unconsumed orders
      offsetResetPolicy: latest`
    }
  },
  {
    id: "traffic-shaping",
    title: "2. Ingress Traffic Shaping & Load Leveling",
    badge: "Ingress Controls",
    color: "orange",
    summary: "Regulates unpredictable incoming packet floods using Token Bucket rate limiters, Kafka asynchronous buffers, and graceful feature degradation.",
    problemAddressed: "Unchecked client retry loops (users hammering 'Refresh' when orders stall) act as an internal DDoS, amplifying back-end collapse.",
    controls: [
      {
        name: "Two-Tier Token Bucket Rate Limiting",
        description: "Tier 1 limits aggressive scraping bots (50 req/min/IP). Tier 2 limits authenticated user actions (max 3 checkout attempts/minute with enforced client backoff).",
        tooling: "Envoy Proxy / Kong Rate Limiting Plugin",
      },
      {
        name: "Asynchronous Queue-Based Load Leveling",
        description: "Checkout endpoint writes order intents immediately to Kafka in <10ms and responds with HTTP 202 Accepted + Order Tracking Polling Token, decoupling client UI from synchronous DB commits.",
        tooling: "Apache Kafka / AWS SQS FIFO",
      },
      {
        name: "Virtual Waiting Room & Graceful Feature Shedding",
        description: "Under extreme surge (>120k RPS), non-essential compute-heavy services (e.g. AI-driven personalized recommendations, animated banners) are dynamically turned off, reserving 100% of compute for checkout transactions.",
        tooling: "Feature Flag toggles (LaunchDarkly / Unleash) & Cloudflare Waiting Room",
      }
    ],
    codeSnippet: {
      title: "envoy-token-bucket-ratelimit.yaml",
      language: "yaml",
      code: `descriptors:
  - key: request_type
    value: checkout_submit
    rate_limit:
      unit: minute
      requests_per_unit: 5 # Prevent duplicate dinner panic taps
  - key: client_tier
    value: anonymous_browse
    rate_limit:
      unit: second
      requests_per_unit: 40
  - key: api_route
    value: menu_search
    shadow_mode: false
    rate_limit:
      unit: second
      requests_per_unit: 250`
    }
  },
  {
    id: "database-cache",
    title: "3. Database Protection & Cache Stampede Elimination",
    badge: "Data Layer Controls",
    color: "emerald",
    summary: "Guards the relational ACID database against thread starvation using PgBouncer multiplexing and eliminates cache thundering herds using XFetch probabilistic renewal.",
    problemAddressed: "PostgreSQL max_connections limit (500) breached when 120 pods launched, triggering sudden death across all microservices.",
    controls: [
      {
        name: "Connection Pooling with PgBouncer Proxy",
        description: "Multiplexes 2,500+ client connections from transient microservice pods down into a fixed, highly optimized pool of 64 dedicated server connections to PostgreSQL.",
        tooling: "PgBouncer (Transaction pooling mode) / AWS RDS Proxy",
      },
      {
        name: "Read-Write Splitting with Auto-scaling Replicas",
        description: "Aurora Read Replicas dynamically scale from 1 to 5 during dinner hours. 92% of queries (menu lookups, restaurant ratings, address book) route to replicas, isolating primary for writes.",
        tooling: "AWS Aurora Auto-scaling / PostgreSQL pgpool-II",
      },
      {
        name: "Probabilistic Early Expiration (XFetch Algorithm)",
        description: "Prevents cache stampedes. When a popular restaurant menu's TTL nears expiry, a probabilistic formula causes exactly ONE background thread to refresh it before it expires, completely shielding the database.",
        tooling: "Redis 7.2 Cluster + Node/Go XFetch Implementation",
      }
    ],
    codeSnippet: {
      title: "xfetch-cache-stampede-preventer.js",
      language: "javascript",
      code: `/**
 * XFetch: Optimal Probabilistic Early Expiration Algorithm
 * Prevents Cache Stampede / Thundering Herd on popular menus
 */
async function getRestaurantMenu(restaurantId) {
  const cacheKey = \`menu:\${restaurantId}\`;
  const cached = await redis.hgetall(cacheKey);

  const now = Date.now();
  if (cached && cached.value) {
    const delta = parseFloat(cached.computationTimeMs || 250);
    const beta = 1.0; // Eagerness multiplier
    const ttlRemaining = parseFloat(cached.expiresAt) - now;

    // Probabilistic trigger: if early renewal fires, refresh asynchronously
    const shouldRefreshEarly = (-beta * delta * Math.log(Math.random())) > ttlRemaining;
    
    if (shouldRefreshEarly && ttlRemaining > 0) {
      // Recompute in background; serve current stale-while-revalidate data immediately
      refreshMenuInBackground(restaurantId, cacheKey);
      return JSON.parse(cached.value);
    }
    
    if (ttlRemaining > 0) {
      return JSON.parse(cached.value); // Cache hit!
    }
  }

  // Cache completely expired or missing: acquire distributed mutex
  return await fetchAndCacheMenuWithLock(restaurantId, cacheKey);
}`
    }
  },
  {
    id: "fault-isolation",
    title: "4. Microservice Resilience & Blast Radius Containment",
    badge: "Fault Tolerance",
    color: "purple",
    summary: "Isolates failures using Circuit Breakers, Bulkheading, and Chaos Engineering so third-party delays don't cascade.",
    problemAddressed: "Third-party payment gateway latency (4.5s) held HTTP worker threads hostage until entire platform froze with 504 errors.",
    controls: [
      {
        name: "Circuit Breakers with Fallback Payloads",
        description: "If payment gateway latency exceeds 2.5s on 30% of requests over a 10s sliding window, the circuit immediately OPENS. Traffic is redirected to backup PSPs or Cash-on-Delivery fallback.",
        tooling: "Resilience4j / Envoy Mesh Outlier Detection",
      },
      {
        name: "Thread Bulkheading & Resource Quotas",
        description: "Isolates high-frequency GPS rider tracking pings onto dedicated thread pools and CPU cgroups. A spike in rider tracking can never starve core payment or checkout threads.",
        tooling: "Resilience4j Bulkhead / Kubernetes Cgroups v2",
      },
      {
        name: "SRE Golden Signals & Automated Canary Rollouts",
        description: "Monitors Google SRE 4 Golden Signals (Latency, Traffic, Errors, Saturation). High p99 latency automatically halts deployment pipelines and executes automated rollbacks.",
        tooling: "Prometheus + Grafana + Argo Rollouts",
      }
    ],
    codeSnippet: {
      title: "resilience4j-circuit-breaker.properties",
      language: "properties",
      code: `# Resilience4j Circuit Breaker for External Payment Gateways
resilience4j.circuitbreaker.instances.paymentGateway.slidingWindowType=COUNT_BASED
resilience4j.circuitbreaker.instances.paymentGateway.slidingWindowSize=50
resilience4j.circuitbreaker.instances.paymentGateway.minimumNumberOfCalls=20
resilience4j.circuitbreaker.instances.paymentGateway.failureRateThreshold=40.0
resilience4j.circuitbreaker.instances.paymentGateway.slowCallRateThreshold=50.0
resilience4j.circuitbreaker.instances.paymentGateway.slowCallDurationThreshold=2500ms
resilience4j.circuitbreaker.instances.paymentGateway.waitDurationInOpenState=15000ms
resilience4j.circuitbreaker.instances.paymentGateway.permittedNumberOfCallsInHalfOpenState=10
resilience4j.circuitbreaker.instances.paymentGateway.automaticTransitionFromOpenToHalfOpenEnabled=true`
    }
  }
];

export const CIRCUIT_BREAKER_STATES = {
  CLOSED: {
    status: "CLOSED",
    color: "emerald",
    description: "Normal Operation. All downstream payment and database calls flow unimpeded. Error and slow call counters are tracked within sliding window.",
  },
  OPEN: {
    status: "OPEN",
    color: "rose",
    description: "Circuit Tripped! Error or latency threshold breached. Downstream calls fail-fast immediately without waiting, invoking secondary fallback payment rails.",
  },
  HALF_OPEN: {
    status: "HALF_OPEN",
    color: "amber",
    description: "Trial Recovery. A controlled percentage of trial requests are dispatched downstream. If they succeed within latency SLA, circuit resets to CLOSED.",
  }
};
