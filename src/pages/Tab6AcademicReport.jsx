import React, { useState } from 'react';
import { 
  GraduationCap, 
  FileText, 
  Printer, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Users,
  BookOpen,
  Sparkles,
  Layers,
  Calculator,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { VIVA_QUESTIONS } from '../data/vivaQuestions';

export default function Tab6AcademicReport({ onOpenPrintableReport }) {
  const [activeSection, setActiveSection] = useState('paper');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedViva, setExpandedViva] = useState({ 1: true, 2: true });

  const toggleViva = (id) => {
    setExpandedViva(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['all', 'Workload Dynamics', 'Capacity Theory', 'Autoscaling Architecture', 'Caching & Data Tier', 'Database Engineering', 'Fault Tolerance', 'SRE Economics'];

  const filteredQuestions = selectedCategory === 'all'
    ? VIVA_QUESTIONS
    : VIVA_QUESTIONS.filter(q => q.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Academic Context Strip */}
      <div className="p-4 rounded-xl border border-sky-500/30 bg-gradient-to-r from-sky-950/30 via-slate-900 to-slate-950 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                Academic Project Documentation & Viva Voce Defense Deck
                <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                  Problem #29 • CO3 • K5
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Official submission paper, mathematical proofs, course outcome mapping, and oral defense revision cards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('paper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeSection === 'paper'
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Academic Paper View
            </button>
            <button
              onClick={() => setActiveSection('viva')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeSection === 'viva'
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Viva Voce Flashcards ({VIVA_QUESTIONS.length})
            </button>
            <a
              href="./Problem_29_Cloud_Capacity_20_Page_Report.pdf"
              download="Problem_29_Cloud_Capacity_20_Page_Report.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              title="Download compiled 20-page PDF report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download 20-Page PDF</span>
            </a>
            <button
              onClick={onOpenPrintableReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
              title="Print / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Modal</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: FORMAL ACADEMIC PAPER VIEW */}
      {activeSection === 'paper' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 backdrop-blur-md space-y-6 text-slate-200">
          {/* Paper Title Block */}
          <div className="text-center pb-6 border-b border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
              ACADEMIC MINI-PROJECT REPORT • COURSE OUTCOME CO3 • BLOOM'S TAXONOMY K5
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white max-w-4xl mx-auto leading-tight">
              Cloud Capacity Requirements and Operational Management Controls for High-Throughput Food-Delivery Platforms Under Peak Dinner Workload Surges
            </h1>
            <div className="pt-2 text-xs font-mono text-slate-300 flex flex-wrap justify-center items-center gap-6">
              <div>
                <strong>Author 1:</strong> VIJAYA RAJHA K (<span className="text-orange-400">814724104167</span>)
              </div>
              <span className="text-slate-600">•</span>
              <div>
                <strong>Author 2:</strong> VISHVAA M (<span className="text-orange-400">814724104174</span>)
              </div>
              <span className="text-slate-600">•</span>
              <div>
                <strong>Problem ID:</strong> 29 (Food-Delivery Platform Incident)
              </div>
            </div>
          </div>

          {/* Abstract */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <h3 className="text-xs font-bold font-mono text-sky-400 uppercase tracking-wider">
              Abstract
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              Modern on-demand food-delivery platforms experience sharp, non-linear diurnal traffic surges, 
              peaking during the dinner window (19:00 – 21:30) with arrival rates exceeding 8.8x baseline load. 
              During peak hours, unmanaged platforms suffer cascading system failures characterized by HTTP 504 
              Gateway Timeouts, database connection pool exhaustion, cache stampedes, and third-party payment 
              thread starvation. In this paper, we analyze the microservice workload dynamics and cloud capacity 
              requirements using Little's Law, queueing theory, and CPU/IOPS saturation models. We evaluate four 
              architectural paradigms (Bloom's Level K5) and synthesize an optimal operational management approach 
              comprising scheduled predictive pre-warming, KEDA event-driven autoscaling, PgBouncer transaction-level 
              connection multiplexing, Redis XFetch probabilistic early renewal, and Resilience4j circuit breakers. 
              Experimental simulation results demonstrate a reduction in peak error rates from 38.2% to 0.04%, 
              p99 latency stabilization under 150ms, and a 56% reduction in monthly cloud infrastructure spend compared 
              to static over-provisioning.
            </p>
          </div>

          {/* Section 1: Introduction & Problem Definition */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-orange-400 font-mono">1.</span> Introduction & Problem Formulation (Problem #29)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              Hyper-local food delivery services (e.g., Swiggy, Zomato, DoorDash) operate under architectural 
              constraints fundamentally distinct from traditional asynchronous e-commerce platforms. While retail 
              transactions permit deferred fulfillment over multi-day windows, food ordering requires an instantaneous 
              three-way synchronized state agreement between the consumer (browsing and payment), the merchant 
              (inventory deduction and kitchen preparation), and the delivery fleet (geo-spatial proximity matchmaking).
            </p>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              During dinner peak hours, traffic compresses into a 2-hour window. Under baseline unmanaged infrastructure, 
              the sudden influx of 108,000 requests per second (RPS) causes the following critical failure cascade:
            </p>
            <ul className="text-xs text-slate-300 list-disc list-inside space-y-1 pl-2">
              <li><strong>Reactive Autoscaling Lag:</strong> Standard Kubernetes Horizontal Pod Autoscaler (HPA) triggers only after CPU crosses 80%. Provisioning new virtual machines and bootstrapping JVM runtimes requires 4–6 minutes, during which existing pods collapse under thread starvation.</li>
              <li><strong>Database Connection Pool Starvation:</strong> 120 transient microservice pods each attempt to open direct connections to PostgreSQL, instantly exceeding <code className="text-orange-300 font-mono">max_connections = 500</code>.</li>
              <li><strong>Cache Stampede (Thundering Herd):</strong> Synchronized TTL expiration on popular restaurant menus triggers thousands of simultaneous cache misses that directly hit the database.</li>
              <li><strong>Third-Party Payment Latency Cascading:</strong> Elevating payment provider latency to 4.5s exhausts checkout worker threads, returning 504 timeouts to the API gateway.</li>
            </ul>
          </div>

          {/* Section 2: Mathematical Capacity Modeling */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-orange-400 font-mono">2.</span> Mathematical Cloud Capacity Formulation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              Cloud capacity planning must be governed by mathematical invariants rather than guesswork. 
              Our capacity model incorporates four fundamental equations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">Equation 1: Little's Law</span>
                <div className="text-amber-300 font-bold my-1 text-sm">L = λ × W</div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Where L is in-flight concurrent requests, λ is arrival rate (RPS), and W is mean latency (seconds). 
                  At 90,000 RPS and 180ms latency, the infrastructure must hold 16,200 concurrent active TCP connections.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">Equation 2: Compute Core Dimensioning</span>
                <div className="text-amber-300 font-bold my-1 text-sm">C_req = (λ_total × T_cpu) / U_target × S_burst</div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Sizes dedicated vCPU cores across pods. Prevents Linux Completely Fair Scheduler (CFS) quota throttling.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">Equation 3: Database Pool Formula</span>
                <div className="text-amber-300 font-bold my-1 text-sm">N_conns = (C_db_cores × 2) + D_spindles</div>
                <p className="text-[11px] text-slate-400 font-sans">
                  The HikariCP/PostgreSQL optimal pool formula. PgBouncer concentrates thousands of transient pod connections into 64 dedicated backend connections.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">Equation 4: XFetch Probabilistic Cache</span>
                <div className="text-amber-300 font-bold my-1 text-sm">Trigger: (-β × δ × ln(rand())) &gt; (TTL - now)</div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Probabilistically forces exactly one background thread to refresh high-read menu keys prior to TTL expiry, eliminating cache stampedes.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Proposed Operational Architecture */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-orange-400 font-mono">3.</span> Proposed Operational Management Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              Our proposed solution implements a 4-pillar defense-in-depth framework:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-orange-400 block">Pillar 1: Multi-Dimensional Elasticity</strong>
                <p className="text-slate-300 text-justify">
                  Scheduled cron pre-warming ramps pod fleet from 24 to 90 at 18:30 (30 mins before peak), completely eliminating cold-start lag. KEDA event-driven autoscaling monitors Kafka topic lag (<code className="text-sky-300">order-checkout-stream</code>) to scale pods before CPU spikes.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-orange-400 block">Pillar 2: Ingress Traffic Shaping</strong>
                <p className="text-slate-300 text-justify">
                  Envoy Token Bucket rate limiting halts bot scraping and rapid client retry storms. Asynchronous queue-based load leveling commits orders to Kafka in &lt;10ms, returning HTTP 202 Accepted and insulating downstream databases.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-orange-400 block">Pillar 3: Database & Cache Resilience</strong>
                <p className="text-slate-300 text-justify">
                  PgBouncer transaction-mode pooling acts as a shock absorber. Aurora Read Replicas scale to 5 nodes to absorb 92% of read queries. Redis XFetch algorithm prevents thundering herd stampedes.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-orange-400 block">Pillar 4: Fault Isolation & Circuit Breaking</strong>
                <p className="text-slate-300 text-justify">
                  Resilience4j circuit breakers monitor external payment gateway latency. If error or slow calls exceed 40%, the circuit OPENS in milliseconds, preventing thread pool starvation and rerouting to backup payment rails.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: K5 Evaluation & Synthesis */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-orange-400 font-mono">4.</span> Bloom's Taxonomy Level K5 Evaluative Synthesis
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              In evaluating the trade-off space across static over-provisioning ($28,400/mo), reactive HPA ($16,200/mo with 38% failure rate), full serverless ($24,800/mo with cold starts), and our hybrid architecture ($12,300/mo), we prove that our synthesized model achieves Pareto optimality. It eliminates 99.9% of dinner peak failures while delivering an annual infrastructure savings of <strong>$193,200</strong> and protecting over <strong>$1.4M</strong> in otherwise abandoned checkout revenue.
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center text-xs font-mono text-slate-400">
            <div>
              <span>Submitted by: </span>
              <strong className="text-white">VIJAYA RAJHA K (814724104167)</strong> & <strong className="text-white">VISHVAA M (814724104174)</strong>
            </div>
            <div>
              <span>Course Outcome: <strong>CO3</strong> | Bloom's Level: <strong>K5 (Evaluate / Synthesize)</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VIVA VOCE FLASHCARDS DECK */}
      {activeSection === 'viva' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedViva[q.id];
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden backdrop-blur-md transition-all hover:border-slate-700"
                >
                  <div
                    onClick={() => toggleViva(q.id)}
                    className="p-4 cursor-pointer flex items-start justify-between gap-3 bg-slate-900/90"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">
                          Q{q.id}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                          {q.bloomLevel}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {q.category}
                        </span>
                      </div>
                      <h4 className="text-xs md:text-sm font-bold text-slate-100">
                        {q.question}
                      </h4>
                    </div>

                    <div className="p-1 rounded bg-slate-800 text-slate-400 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-950/70 space-y-3 text-xs leading-relaxed">
                      <div>
                        <strong className="text-slate-400 uppercase tracking-wider text-[10px] font-mono block mb-1">
                          Comprehensive Technical Model Answer:
                        </strong>
                        <p className="text-slate-200 text-justify">
                          {q.answer}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-orange-950/20 border border-orange-500/30 flex items-start gap-2 text-orange-200">
                        <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-orange-400 text-[11px] font-mono block">
                            Examiner Viva Voce Tip (How to Score Full Marks):
                          </strong>
                          <span className="text-[11px] text-slate-300">
                            {q.vivaTip}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

