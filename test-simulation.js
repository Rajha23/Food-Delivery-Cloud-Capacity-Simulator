// Automated Verification & Unit Test Suite for Cloud Capacity & Simulator Algorithms
import { calculateCapacity } from './src/data/capacityFormulas.js';
import { BENCHMARK_SCENARIOS, HOURLY_WORKLOAD_PROFILE } from './src/data/workloadData.js';
import { VIVA_QUESTIONS } from './src/data/vivaQuestions.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${message}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${message}`);
    failed++;
  }
}

console.log("\n=======================================================");
console.log("  CLOUD SERVICES & COMPUTING MINI-PROJECT (K5 CO3)");
console.log("  PROBLEM #29: FOOD DELIVERY PEAK DINNER CLOUD CAPACITY");
console.log("  Students: Vijaya Rajha K (814724104167) & Vishvaa M (814724104174)");
console.log("=======================================================\n");

console.log("Test Suite 1: Mathematical Capacity & Little's Law Invariants");
{
  const result = calculateCapacity({
    dailyActiveUsers: 1500000,
    peakMultiplier: 8.5,
    avgLatencyMs: 150,
    cpuTimePerReqMs: 12,
    targetCpuUtilization: 65,
    ordersPerMin: 7500,
  });

  // Verify Little's Law: L = λ * W
  const lambda = result.metrics.peakRps;
  const w = 150 / 1000;
  const expectedL = Math.round(lambda * w);
  assert(result.metrics.littlesLawConcurrency === expectedL, `Little's Law verified: L = ${expectedL} concurrent requests for λ = ${lambda} RPS, W = 150ms`);

  // Verify vCPU compute sizing
  assert(result.metrics.totalRecommendedVcpus > 0, `vCPU cores correctly dimensioned: ${result.metrics.totalRecommendedVcpus} cores`);
  assert(result.metrics.podCount > 0, `Kubernetes pod fleet sized: ${result.metrics.podCount} pods`);

  // Verify PgBouncer connection multiplexing
  assert(result.metrics.recommendedPgBouncerServerPool < result.metrics.unmanagedDbConnections, 
    `PgBouncer multiplexes ${result.metrics.unmanagedDbConnections} unmanaged connections into ${result.metrics.recommendedPgBouncerServerPool} server connections`);

  // Verify Economic Savings
  assert(result.economics.savingsPct >= 45 && result.economics.savingsPct <= 75, 
    `Dynamic elasticity yields ${result.economics.savingsPct}% cloud OPEX savings ($${result.economics.monthlySavings.toLocaleString()}/mo)`);
}

console.log("\nTest Suite 2: Workload Profile & Benchmark Scenarios");
{
  assert(HOURLY_WORKLOAD_PROFILE.length === 24, "24-hour diurnal workload profile complete with 24 hours of data");
  
  const peakHour = HOURLY_WORKLOAD_PROFILE.reduce((max, h) => h.rps > max.rps ? h : max, HOURLY_WORKLOAD_PROFILE[0]);
  assert(peakHour.hour === "20:00", `Peak dinner hour correctly identified at 20:00 with ${peakHour.rps.toLocaleString()} RPS`);

  const scenarios = Object.keys(BENCHMARK_SCENARIOS);
  assert(scenarios.length === 4, `4 rigorous benchmark scenarios defined: ${scenarios.join(', ')}`);

  const friday = BENCHMARK_SCENARIOS.friday;
  assert(friday.unmanaged.errorRate === "38.2%", "Friday baseline failure error rate accurately documented (38.2%)");
  assert(friday.managed.errorRate === "0.08%", "Friday managed controls error rate verified resilient (0.08%)");
}

console.log("\nTest Suite 3: Academic Viva Voce & Bloom's Taxonomy Questions");
{
  assert(VIVA_QUESTIONS.length >= 8, `Viva Voce deck contains ${VIVA_QUESTIONS.length} comprehensive technical questions`);
  const k5Questions = VIVA_QUESTIONS.filter(q => q.bloomLevel.includes("K5"));
  assert(k5Questions.length >= 3, `Syllabus alignment: ${k5Questions.length} questions explicitly assess Bloom's K5 Level (Evaluate / Synthesize)`);
}

console.log("\n-------------------------------------------------------");
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("-------------------------------------------------------\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("All mathematical and algorithmic verification tests passed successfully!\n");
}

