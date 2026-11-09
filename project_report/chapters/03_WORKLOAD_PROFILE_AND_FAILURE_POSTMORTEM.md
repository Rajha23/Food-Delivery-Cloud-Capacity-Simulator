# Chapter 3: Workload Characterization & Failure Post-Mortem

## 3.1 24-Hour Diurnal Workload Profile
The application's workload was measured across all operating metropolitan zones to establish baseline vs peak characteristics:

| Hour | Requests / Sec (RPS) | Orders / Minute | Active App Users | Operational Phase |
|:---:|:---:|:---:|:---:|:---|
| 00:00 – 05:00 | 1,200 – 4,200 | 40 – 210 | 12,000 – 45,000 | Deep Off-Peak Base Load |
| 06:00 – 08:00 | 4,800 – 18,500 | 240 – 1,250 | 50,000 – 220,000 | Breakfast Ramp (1.8x Baseline) |
| 09:00 – 11:00 | 16,500 – 24,000 | 980 – 1,650 | 190,000 – 290,000 | Pre-Lunch Browse |
| 12:00 – 14:00 | 46,000 – 52,000 | 3,400 – 3,950 | 580,000 – 640,000 | Lunch Peak (4.3x Baseline) |
| 15:00 – 17:00 | 19,500 – 28,500 | 1,150 – 1,800 | 240,000 – 350,000 | Teatime Snack Slump |
| 18:00 – 19:00 | 42,000 – 74,000 | 2,900 – 5,600 | 520,000 – 920,000 | Early Dinner Browse |
| **19:30 – 21:00** | **96,000 – 108,000** | **7,800 – 8,900** | **1,280,000 – 1,450,000** | **PEAK DINNER CRISIS (8.8x – 9.0x)** |
| 21:30 – 23:00 | 54,000 – 18,000 | 4,100 – 1,100 | 680,000 – 220,000 | Late Night Wind-Down |

---

## 3.2 Chronological Outage Timeline (18:45 – 21:15)
The failure sequence unfolded in five distinct degradation phases:

```
18:45  [Normal Operations]
       Traffic: 38,500 RPS. CPU: 45%. Average Latency: 120ms. Active Pods: 24.
       Baseline traffic increases steadily as customers begin browsing dinner menus.

19:15  [Autoscaling Cold-Start Lag]
       Traffic: 68,000 RPS (+76% spike in 30 min). Reactive HPA triggers scale-up.
       Virtual machine provisioning, container image pulling, and JVM warm-up take 5 minutes.
       Existing 24 pods operate at 88% CPU; response latency creeps from 120ms to 480ms.

19:35  [Cache Stampede on Top Restaurant Menus]
       Traffic: 89,000 RPS. The city's top 50 restaurants shared a 30-minute Redis TTL that
       expired at exactly 19:30. Over 15,000 concurrent browsing queries simultaneously
       miss Redis and flood the primary PostgreSQL database. Database CPU hits 98%.

19:55  [PostgreSQL Connection Pool Exhaustion (FATAL)]
       Traffic: 105,000 RPS. 120 autoscaled microservice pods each maintain 25 local
       connections. Total active connections attempt to hit 3,000, blowing past
       max_connections = 500. PostgreSQL starts rejecting connections with fatal errors.

20:10  [Payment Gateway Timeout & Thread Starvation]
       Traffic: 112,000 RPS. External payment gateways experience peak load delays (4.5s).
       Without circuit breakers, the Checkout service holds worker threads open waiting
       for callbacks. Worker thread pools are completely exhausted, returning 504 timeouts.

20:30  [Self-Inflicted User Retry Storm]
       Traffic: 128,000 RPS. Panicked customers repeatedly tap "Place Order" and refresh
       restaurant pages. Spurious retries compound the outage by an additional +35% load.

21:15  [Recovery & Post-Mortem]
       Manual SRE traffic shedding takes effect as dinner peak subsides naturally.
       Total damage: 38,500 failed checkouts and $420,000 in direct GMV loss.
```

---

## 3.3 Root-Cause Analysis (Fishbone / Ishikawa Mapping)
The outage was caused by four interconnected architectural vulnerabilities:
1. **Reactive Autoscaling Lag:** Inherent 4-6 minute delay in reactive pod startup vs 90-second traffic step surge.
2. **Connection Pool Starvation:** Direct unmanaged JDBC connections from 120 pods overwhelming PostgreSQL `max_connections = 500`.
3. **Synchronized Cache Stampede:** Deterministic TTL expiry triggering a 15,000-query thundering herd against PostgreSQL.
4. **Unshielded Third-Party Payment Latency:** Synchronous blocking calls holding worker threads hostage until the gateway failed.
