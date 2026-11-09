// Viva Voce & Academic Defense Question Deck (K5 CO3)

export const VIVA_QUESTIONS = [
  {
    id: 1,
    question: "Why do food-delivery platforms experience catastrophic failures specifically during peak dinner hours, while standard e-commerce platforms handle surges more smoothly?",
    bloomLevel: "K4 - Analyze",
    courseOutcome: "CO3",
    category: "Workload Dynamics",
    answer: "Unlike retail e-commerce (e.g. Amazon) where users browse and can accept shipping delays of 2-3 days, food delivery is hyper-time-sensitive with extreme localized concurrency. Dinner traffic concentrates 70-80% of daily transactions into a razor-thin 2-hour window (19:30-21:30). Furthermore, each transaction requires high-frequency synchronous coordinates: customer, restaurant inventory/prep time, and localized rider GPS matching. If any link in this chain stalls, users panic and retry, turning a temporary delay into an exponential cascading failure.",
    vivaTip: "Emphasize the 'hyper-localized, real-time three-way handshake' (Customer - Restaurant - Rider) vs asynchronous deferred delivery in standard e-commerce."
  },
  {
    id: 2,
    question: "How does Little's Law (L = λ * W) apply to sizing cloud capacity during dinner peak surges?",
    bloomLevel: "K5 - Evaluate",
    courseOutcome: "CO3",
    category: "Capacity Theory",
    answer: "Little's Law states that the average number of concurrent requests (L) equals the arrival rate (λ) multiplied by the average response time (W). During dinner peak, if λ jumps from 10,000 to 90,000 RPS, and downstream latency (W) degrades from 100ms (0.1s) to 1,500ms (1.5s) due to database lock contention, the number of concurrent in-flight requests explodes from L = 10,000 * 0.1 = 1,000 to L = 90,000 * 1.5 = 135,000 concurrent requests! This 135x explosion in concurrency instantly saturates thread pools, socket buffers, and connection pools, crashing the servers.",
    vivaTip: "State clearly that when latency increases under load, concurrency does not stay flat—it increases multiplicatively, creating a death spiral."
  },
  {
    id: 3,
    question: "Why did standard Kubernetes Horizontal Pod Autoscaler (HPA) fail to prevent the dinner outage?",
    bloomLevel: "K4 - Analyze",
    courseOutcome: "CO3",
    category: "Autoscaling Architecture",
    answer: "Standard HPA is inherently reactive and relies on lagging indicators (e.g. 3-minute average CPU or Memory utilization). During peak dinner, traffic does not increase gradually; it spikes in a step-function (e.g. +300% in 90 seconds when office workers get home or half-time begins). Provisioning new cloud nodes takes 2-4 minutes, pulling docker images takes 1-2 minutes, and JVM/framework warmup takes 30-60 seconds. By the time reactive pods become Ready, the existing pods are already dead from OOM or connection timeouts. Solution: Scheduled predictive pre-warming at 18:30 + KEDA event-driven scaling on queue lag.",
    vivaTip: "Distinguish between 'Lagging Metrics' (CPU/RAM) and 'Leading Metrics' (Kafka queue lag, scheduled cron, weather triggers)."
  },
  {
    id: 4,
    question: "What is a 'Cache Stampede' (Thundering Herd) and how does the XFetch algorithm prevent it?",
    bloomLevel: "K5 - Evaluate",
    courseOutcome: "CO3",
    category: "Caching & Data Tier",
    answer: "A cache stampede occurs when a high-read cached item (e.g., the menu of the #1 popular biryani restaurant ordered by 25,000 users) expires. When TTL reaches 0, thousands of concurrent requests simultaneously miss the cache and hit the primary database to regenerate the menu. The database crashes under the sudden 25,000-query thundering herd. The XFetch algorithm uses probabilistic early renewal: as TTL winds down, requests evaluate a probabilistic formula based on computation time (δ) and randomness. Exactly ONE background worker refreshes the cache before expiry, while all other dinner customers continue getting instant cache hits.",
    vivaTip: "Mention that standard TTL expiration is deterministic and synchronized; XFetch introduces probabilistic asynchronous renewal."
  },
  {
    id: 5,
    question: "Explain why the database connection pool is the single most vulnerable bottleneck during rapid scaling.",
    bloomLevel: "K4 - Analyze",
    courseOutcome: "CO3",
    category: "Database Engineering",
    answer: "Relational databases like PostgreSQL allocate a dedicated operating system process/thread per connection, consuming ~5-10MB of RAM and competing for CPU scheduler time. PostgreSQL performs best with fewer connections (typically cores * 2 + spindles, around 64-100). If an autoscaler scales application pods from 20 to 150, and each pod configures a local connection pool of 20 connections, the backend attempts to open 3,000 concurrent database connections. The database runs out of RAM, thrashes in context switching, and starts rejecting connections with 'FATAL: sorry, too many clients already'.",
    vivaTip: "Explain how PgBouncer solves this by acting as an intermediary multiplexer between thousands of pod clients and a lean pool of 64 PostgreSQL backend connections."
  },
  {
    id: 6,
    question: "What is the role of a Circuit Breaker during third-party payment gateway slowdowns?",
    bloomLevel: "K5 - Evaluate",
    courseOutcome: "CO3",
    category: "Fault Tolerance",
    answer: "When external payment partners (e.g. UPI networks, Razorpay, Stripe) experience peak slowdowns and take 5 seconds to respond, upstream application threads remain blocked waiting for the HTTP response. Without a circuit breaker, all available HTTP worker threads become blocked in seconds, rendering the entire website unable to even serve static homepages. A circuit breaker monitors error and slow-call rates. When thresholds exceed 40%, it trips to 'OPEN', instantly failing-fast or rerouting traffic to secondary backup payment rails without consuming application threads.",
    vivaTip: "Draw the 3 states: CLOSED (normal) -> OPEN (fail-fast / fallback) -> HALF-OPEN (testing trial requests)."
  },
  {
    id: 7,
    question: "Compare Static Over-Provisioning vs Dynamic Elasticity with Hybrid Operational Controls from an SRE and Cost perspective.",
    bloomLevel: "K5 - Evaluate / Synthesize",
    courseOutcome: "CO3",
    category: "SRE Economics",
    answer: "Static over-provisioning means keeping peak capacity (e.g. 150 pods, 16-node Kubernetes cluster, 5 DB replicas) running 24/7. While it avoids cold-start outages, it results in massive cloud waste (average CPU utilization < 12% during 01:00-11:00), driving monthly infrastructure costs to $28,000+. Dynamic elasticity combined with hybrid operational controls (scheduled pre-warming + KEDA + PgBouncer) runs at lean baseline during off-peak and scales just-in-time for dinner. This achieves 99.99% availability at only $12,300/month—a 56% net savings ($188,400 saved annually).",
    vivaTip: "Highlight the K5 trade-off: reliability without efficiency is bad engineering; hybrid operational controls achieve both maximum reliability and optimum cloud economics."
  },
  {
    id: 8,
    question: "What is Queue-based Load Leveling and how does Kafka decouple checkout from order persistence?",
    bloomLevel: "K4 - Analyze",
    courseOutcome: "CO3",
    category: "Asynchronous Architecture",
    answer: "In synchronous processing, the client waits for the web server to write to PostgreSQL, lock inventory, and confirm payment in one synchronous HTTP POST. If 10,000 orders arrive in 10 seconds, the database collapses. Queue-based load leveling introduces an immutable Kafka append-only log. The checkout API validates input, appends an 'OrderPlacedEvent' to Kafka in <10ms, and responds immediately with HTTP 202 Accepted. Downstream consumer worker pools consume from Kafka at a steady, sustainable rate (e.g. 150 orders/sec) that never exceeds database capacity.",
    vivaTip: "Emphasize that Kafka acts as a shock absorber / surge buffer between fast client arrivals and capacity-constrained database writes."
  }
];
