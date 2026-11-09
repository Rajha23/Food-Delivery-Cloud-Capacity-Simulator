# Chapter 4: Mathematical Cloud Capacity Modeling

## 4.1 Little's Law Invariant Formulation (Queueing Theory)
John Little's fundamental theorem states that the long-term average number of concurrent requests $L$ held within a stationary queueing system equals the arrival rate $\lambda$ multiplied by the average time $W$ a request spends in the system:

$$L = \lambda \times W$$

Where:
- $L$ = Number of concurrent in-flight requests held in TCP socket tables, OS buffers, and thread pools.
- $\lambda$ = Arrival rate in Requests Per Second (RPS).
- $W$ = Mean response latency (seconds).

### Numerical Proof of Concurrency Explosion
- **Baseline Healthy State (18:45):**
  $$\lambda = 38,500 \text{ RPS}, \quad W = 0.120 \text{ s} \implies L = 38,500 \times 0.120 = \mathbf{4,620 \text{ concurrent requests}}$$
- **Dinner Peak With Latency Degradation (20:10):**
  When database connection locks and payment gateway stalls increase average response time $W$ from 120ms to 1,500ms (1.5s):
  $$\lambda = 108,000 \text{ RPS}, \quad W = 1.500 \text{ s} \implies L = 108,000 \times 1.5 = \mathbf{162,000 \text{ concurrent in-flight requests}}$$

*Theoretical Deduction:* Latency deterioration under heavy arrival load causes an explosive **35x surge in concurrency**, rapidly exhausting server socket buffers and worker threads.

---

## 4.2 vCPU Compute Core Dimensioning
The number of dedicated virtual CPU cores $C_{\text{req}}$ required to sustain aggregated microservice execution without experiencing Linux Completely Fair Scheduler (CFS) quota throttling is modeled as:

$$C_{\text{req}} = \frac{\lambda_{\text{total}} \times T_{\text{cpu}}}{U_{\text{target}}} \times S_{\text{burst}}$$

Where:
- $\lambda_{\text{total}} = 108,000 \times 4.2 \text{ (fan-out)} = 453,600 \text{ internal RPCs/sec}$.
- $T_{\text{cpu}}$ = Active CPU execution time per request (excluding I/O wait) = $0.012 \text{ s}$ ($12 \text{ ms}$).
- $U_{\text{target}}$ = Target sustained CPU ceiling = $0.65$ ($65\%$, leaving 35% headroom).
- $S_{\text{burst}}$ = Safety burst multiplier = $1.25$ ($25\%$ contingency).

### Calculation:
$$C_{\text{req}} = \frac{453,600 \times 0.012}{0.65} \times 1.25 = \mathbf{10,468 \text{ milli-cores} \implies 130 \text{ dedicated vCPUs}}$$

- Pod Allocation (profile: 2 vCPU, 4GB RAM): $\lceil 130 / 2 \rceil = \mathbf{65 \text{ pods}}$.
- Node Allocation (8-vCPU instances, e.g., AWS `m6i.2xlarge`): $\lceil 130 / 7 \rceil = \mathbf{19 \text{ worker nodes}}$.

---

## 4.3 Database Connection Pool Sizing (HikariCP / PgBouncer Formula)
The PostgreSQL official performance model establishes that optimal relational database throughput is achieved when the active connection pool count $N_{\text{connections}}$ satisfies:

$$N_{\text{connections}} = (C_{\text{db\_cores}} \times 2) + D_{\text{spindles}}$$

Where:
- $C_{\text{db\_cores}}$ = Number of physical/virtual CPU cores allocated to the database (32 cores for `db.r6g.4xlarge`).
- $D_{\text{spindles}}$ = Disk spindle/channel concurrency factor ($8$ for high-IOPS NVMe SSD storage).

### Calculation:
$$N_{\text{connections}} = (32 \times 2) + 8 = 64 + 8 = \mathbf{72 \text{ optimal server connections}}$$

Without **PgBouncer**, 120 pods each maintaining 25 connections attempted 3,000 connections against a database configured for 500 connections. PgBouncer multiplexes 3,000 client connections into a fixed pool of **72 to 96 dedicated server connections**, maximizing PostgreSQL throughput while eliminating context-switch thrashing.

---

## 4.4 Probabilistic Early Expiration (The XFetch Algorithm)
To eliminate the cache stampede (thundering herd) that crippled search at 19:35, we employ the XFetch algorithm developed by Vattani et al.:

$$\text{Early Refresh Trigger: } [ -\beta \times \delta \times \ln(\text{rand}()) ] > (\text{TTL} - \text{now})$$

Where:
- $\beta$ = Aggressiveness renewal parameter ($\beta = 1.0$).
- $\delta$ = Computation time taken to compute menu from PostgreSQL ($250 \text{ ms}$).
- $\text{rand}()$ = Uniform pseudo-random number drawn from $(0, 1]$.
- $\text{TTL} - \text{now}$ = Remaining lifetime of the cache entry in seconds.

### Mechanics:
As $\text{TTL} - \text{now}$ approaches zero, the trigger condition evaluates to `true` probabilistically. When triggered, **exactly one** background worker thread refreshes the cache entry in the background. All concurrent customers continue reading the existing cached payload with zero wait time.
