# Chapter 1: Introduction and Problem Context (Problem #29)

## 1.1 Problem Statement Overview
**Problem Number:** 29  
**Specification:**  
> *"A food-delivery platform experiences application failures during peak dinner hours. Analyze its cloud capacity requirements and recommend an operational management approach. Analyzes workload patterns and recommends suitable operational controls. (K5 CO3)"*

**Target Course Outcome:**  
- **CO3:** Analyze cloud capacity requirements, performance bottlenecks, and design robust operational management solutions.

**Target Cognitive Domain Level:**  
- **Bloom's Taxonomy Level K5 (Evaluate / Synthesize):** Requires evaluating opposing operational architectures (e.g. static over-provisioning vs reactive autoscaling vs serverless) and synthesizing a Pareto-optimal hybrid operational control system.

**Student Investigators:**  
- **VIJAYA RAJHA K (814724104167)**  
- **VISHVAA M (814724104174)**  

---

## 1.2 Domain Characteristics
Unlike traditional e-commerce web applications (e.g., Amazon, Flipkart) where user checkout transactions can be deferred, buffered, and processed asynchronously across multi-day shipment intervals, on-demand food delivery is an ultra-latency-sensitive, hyper-localized business. 

Every food delivery order requires an immediate synchronous three-way state agreement:
1. **The Consumer:** Actively searching restaurants, applying coupons, and completing payment within seconds.
2. **The Restaurant Kitchen:** Acknowledging the incoming order and confirming prep capacity against available inventory.
3. **The Delivery Fleet:** Selecting, matchmaking, and dispatching a nearby courier using high-frequency GPS coordinate pings.

Because societal eating behaviors are synchronized around dinner time (19:00 – 21:30 hrs), over 75% of daily Gross Merchandise Value (GMV) is generated within a narrow 2.5-hour operational window.

---

## 1.3 The Friday Peak Dinner Incident (#INC-2026-1109)
On a representative high-volume Friday evening, the food-delivery platform experienced a catastrophic P0 operational failure across its top metropolitan service clusters:

- **Ingress Traffic Escalation:** At 19:15, request arrivals surged by +76% in 30 minutes, escalating from a baseline of 12,200 RPS to a peak of **108,000 RPS** at 20:00 (an 8.8x surge multiplier).
- **Service Degradation:** At 19:35, restaurant menu pages failed to render, returning blank screens.
- **Cascading Failure:** At 19:55, user checkout requests stalled with spinners lasting over 60 seconds, followed by widespread **HTTP 504 Gateway Timeouts**.
- **User Retry Amplification:** Frustrated customers repeatedly tapped "Place Order" and refreshed menu listings. This uncontrolled client retry loop generated an internal DDoS storm that amplified total arrival load by an additional **+35%**.
- **Final Impact:** Over **38,500 customer checkouts failed**, causing **$420,000** in direct lost revenue, significant customer defection to competitor platforms, and severe brand reputation damage.

---

## 1.4 Objectives of this Academic Investigation
1. **Analyze Workload Patterns:** Empirically model the 24-hour diurnal curve and microservice fan-out kinetics.
2. **Formulate Mathematical Capacity Requirements:** Establish exact capacity models using Little's Law ($L = \lambda W$), CPU execution saturation, PgBouncer connection multiplexing, and XFetch caching.
3. **Design Operational Controls:** Propose a 4-pillar defense framework: Predictive Pre-warming, KEDA Kafka autoscaling, Ingress Rate Limiting, and Circuit Breakers.
4. **Bloom's Level K5 Evaluation:** Perform an evaluative synthesis proving the economic and availability superiority of the hybrid operational model.
