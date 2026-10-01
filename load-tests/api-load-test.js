import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const leadLatency = new Trend("lead_latency");
const chatLatency = new Trend("chat_latency");

export const options = {
  scenarios: {
    // Smoke test - verify basic functionality
    smoke: {
      executor: "constant-vus",
      vus: 1,
      duration: "30s",
      tags: { test_type: "smoke" },
    },
    // Load test - expected production load
    load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 50 },   // Ramp up
        { duration: "5m", target: 50 },   // Steady state
        { duration: "2m", target: 100 },  // Stress
        { duration: "5m", target: 100 },  // Steady state
        { duration: "2m", target: 0 },    // Ramp down
      ],
      tags: { test_type: "load" },
    },
    // Spike test - sudden traffic burst
    spike: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 200 }, // Sudden spike
        { duration: "1m", target: 200 },  // Hold spike
        { duration: "10s", target: 0 },   // Drop
      ],
      tags: { test_type: "spike" },
    },
  },
  thresholds: {
    // Performance budgets
    http_req_duration: ["p(95)<2000"],      // 95th percentile < 2s
    http_req_failed: ["rate<0.01"],         // Error rate < 1%
    lead_latency: ["p(95)<1500"],           // Lead submission < 1.5s
    chat_latency: ["p(95)<3000"],           // Chat streaming < 3s
    errors: ["rate<0.05"],                  // Custom error rate < 5%
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

function getCsrfToken(response) {
  const cookies = response.cookies;
  for (const cookie of cookies) {
    if (cookie.name === "zalvy-csrf") {
      return cookie.value;
    }
  }
  return null;
}

export default function () {
  const testType = __ITER_TAGS?.test_type || "load";
  
  // Test /api/leads endpoint
  testLeadSubmission();
  
  // Test /api/v1/ai/chat endpoint
  testChatStreaming();
  
  sleep(1);
}

function testLeadSubmission() {
  const url = `${BASE_URL}/api/leads`;
  
  const payload = {
    name: `Test User ${__VU}-${__ITER}`,
    email: `test-${__VU}-${__ITER}@example.com`,
    company: "Test Company Inc",
    message: "We are interested in deploying AI agents across our engineering organization. This is a load test message with sufficient length to pass validation requirements.",
    intent: "enterprise",
  };

  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const startTime = new Date();
  const response = http.post(url, payload, params);
  const latency = new Date() - startTime;
  
  leadLatency.add(latency);
  
  const success = check(response, {
    "lead status is 200": (r) => r.status === 200,
    "lead response has ok": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.ok === true;
      } catch {
        return false;
      }
    },
    "lead latency < 1500ms": () => latency < 1500,
  });
  
  errorRate.add(!success);
}

function testChatStreaming() {
  // Only test chat on some iterations to reduce load
  if (__ITER % 3 !== 0) return;
  
  const url = `${BASE_URL}/api/v1/ai/chat`;
  
  const payload = JSON.stringify({
    messages: [
      { role: "user", content: "Hello, this is a load test message." },
    ],
    agentId: "zalvy-assistant",
    provider: "gemini",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const startTime = new Date();
  const response = http.post(url, payload, params);
  const latency = new Date() - startTime;
  
  chatLatency.add(latency);
  
  const success = check(response, {
    "chat status is 200 or streaming": (r) => r.status === 200 || r.status === 201,
    "chat latency < 3000ms": () => latency < 3000,
  });
  
  errorRate.add(!success);
}

export function handleSummary(data) {
  return {
    "stdout": textSummary(data, { indent: " ", enableColors: true }),
    "load-test-results.json": JSON.stringify(data, null, 2),
  };
}

function textSummary(data, options) {
  const indent = options.indent || "";
  const colors = options.enableColors;
  
  let summary = `\n${indent}=== LOAD TEST SUMMARY ===\n`;
  summary += `${indent}Total Requests: ${data.metrics.http_reqs?.values?.count || 0}\n`;
  summary += `${indent}Failed Requests: ${data.metrics.http_req_failed?.values?.rate ? (data.metrics.http_req_failed.values.rate * 100).toFixed(2) : 0}%\n`;
  summary += `${indent}Avg Response Time: ${data.metrics.http_req_duration?.values?.avg ? (data.metrics.http_req_duration.values.avg).toFixed(2) : 0}ms\n`;
  summary += `${indent}p95 Response Time: ${data.metrics.http_req_duration?.values?.['p(95)'] ? (data.metrics.http_req_duration.values['p(95)']).toFixed(2) : 0}ms\n`;
  summary += `${indent}Lead p95 Latency: ${data.metrics.lead_latency?.values?.['p(95)'] ? (data.metrics.lead_latency.values['p(95)']).toFixed(2) : 0}ms\n`;
  summary += `${indent}Chat p95 Latency: ${data.metrics.chat_latency?.values?.['p(95)'] ? (data.metrics.chat_latency.values['p(95)']).toFixed(2) : 0}ms\n`;
  summary += `${indent}Error Rate: ${data.metrics.errors?.values?.rate ? (data.metrics.errors.values.rate * 100).toFixed(2) : 0}%\n`;
  
  // Threshold results
  if (data.metrics.http_req_duration?.thresholds) {
    summary += `\n${indent}Threshold Results:\n`;
    for (const [key, threshold] of Object.entries(data.metrics.http_req_duration.thresholds)) {
      summary += `${indent}  ${key}: ${threshold.ok ? '✓ PASS' : '✗ FAIL'}\n`;
    }
  }
  
  return summary;
}