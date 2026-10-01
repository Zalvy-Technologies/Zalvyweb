// scripts/api-contract-tests.mjs
// Tests every API endpoint with proper CSRF double-submit cookie handling.

const BASE = 'http://localhost:3000';
let passCount = 0;
let failCount = 0;

function log(status, test, detail) {
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${status}: ${test} — ${detail}`);
  if (status === 'PASS') passCount++;
  else failCount++;
}

async function fetchCsrfToken() {
  const res = await fetch(`${BASE}/api/health`, { redirect: 'manual' });
  const setCookie = res.headers.getSetCookie?.() ?? [];
  let csrfToken = null;
  for (const c of setCookie) {
    const match = c.match(/zalvy-csrf-token=([^;]+)/);
    if (match) { csrfToken = match[1]; break; }
  }
  if (!csrfToken) {
    const raw = res.headers.get('set-cookie') ?? '';
    const m = raw.match(/zalvy-csrf-token=([^;]+)/);
    if (m) csrfToken = m[1];
  }
  return csrfToken;
}

async function testEndpoint(method, path, options = {}) {
  const { body, expectedStatus, testName, csrfToken, acceptStatuses } = options;
  const headers = { 'Content-Type': 'application/json' };
  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
    headers['Cookie'] = `zalvy-csrf-token=${csrfToken}`;
  }
  const fetchOpts = { method, headers };
  if (body) fetchOpts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE}${path}`, fetchOpts);
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = null; }

    if (acceptStatuses) {
      if (acceptStatuses.includes(res.status)) {
        log('PASS', testName, `Status ${res.status}`);
        return { status: res.status, json, text };
      } else {
        log('FAIL', testName, `Expected one of [${acceptStatuses}], got ${res.status}. Body: ${text.slice(0, 200)}`);
        return { status: res.status, json, text };
      }
    }

    if (expectedStatus && res.status !== expectedStatus) {
      log('FAIL', testName, `Expected ${expectedStatus}, got ${res.status}. Body: ${text.slice(0, 200)}`);
      return { status: res.status, json, text };
    }
    log('PASS', testName, `Status ${res.status}${json?.status ? ` — ${json.status}` : ''}`);
    return { status: res.status, json, text };
  } catch (err) {
    log('FAIL', testName, `Fetch error: ${err.message}`);
    return { status: 0, error: err.message };
  }
}

async function run() {
  console.log('========================================');
  console.log('  ZALVY API Contract Tests (with CSRF)');
  console.log('========================================\n');

  const csrfToken = await fetchCsrfToken();
  if (csrfToken) {
    console.log(`🔑 CSRF token acquired: ${csrfToken.substring(0, 12)}...\n`);
  } else {
    console.log('⚠️  No CSRF token obtained. POST tests may fail with 403.\n');
  }

  // --- GET Endpoints ---
  await testEndpoint('GET', '/api/health', {
    testName: 'GET /api/health (liveness)',
    expectedStatus: 200,
  });

  await testEndpoint('GET', '/api/health?check=readiness', {
    testName: 'GET /api/health?check=readiness (DB offline in dev → 503)',
    expectedStatus: 503,
  });

  await testEndpoint('GET', '/api/v1/docs', {
    testName: 'GET /api/v1/docs (OpenAPI spec)',
    expectedStatus: 200,
  });

  await testEndpoint('GET', '/api/v1/agents', {
    testName: 'GET /api/v1/agents',
    expectedStatus: 200,
  });

  // --- POST Endpoints ---
  await testEndpoint('POST', '/api/v1/leads', {
    testName: 'POST /api/v1/leads (valid enterprise lead)',
    expectedStatus: 200,
    csrfToken,
    body: {
      intent: 'enterprise',
      name: 'QA Test User',
      email: 'qa-test@zalvy-test.dev',
      company: 'Test Corp',
      message: 'This is a QA test lead submission for API contract verification of the ZALVY platform.',
    },
  });

  await testEndpoint('POST', '/api/v1/leads', {
    testName: 'POST /api/v1/leads (missing email → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { intent: 'enterprise', name: 'QA Test', message: 'Missing email field test' },
  });

  await testEndpoint('POST', '/api/v1/leads', {
    testName: 'POST /api/v1/leads (invalid email → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { intent: 'enterprise', name: 'QA Test', email: 'not-an-email', message: 'Invalid email test' },
  });

  await testEndpoint('POST', '/api/leads', {
    testName: 'POST /api/leads (valid JSON lead)',
    expectedStatus: 200,
    csrfToken,
    body: {
      intent: 'enterprise',
      name: 'QA Legacy Lead',
      email: 'qa-legacy@zalvy-test.dev',
      company: 'Legacy Corp',
      message: 'This is a legacy lead endpoint test for QA verification of the ZALVY platform.',
    },
  });

  await testEndpoint('POST', '/api/leads', {
    testName: 'POST /api/leads (empty body → 400)',
    expectedStatus: 400,
    csrfToken,
    body: {},
  });

  await testEndpoint('POST', '/api/v1/ai/verify', {
    testName: 'POST /api/v1/ai/verify (valid format 64-char hash)',
    expectedStatus: 200,
    csrfToken,
    body: { certificateHash: 'a'.repeat(64) },
  });

  await testEndpoint('POST', '/api/v1/ai/verify', {
    testName: 'POST /api/v1/ai/verify (short hash → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { certificateHash: 'abc' },
  });

  await testEndpoint('POST', '/api/v1/ai/verify', {
    testName: 'POST /api/v1/ai/verify (empty → 400)',
    expectedStatus: 400,
    csrfToken,
    body: {},
  });

  await testEndpoint('POST', '/api/v1/ai/knowledge', {
    testName: 'POST /api/v1/ai/knowledge (valid query)',
    expectedStatus: 200,
    csrfToken,
    body: { query: 'What AI services does ZALVY offer?', topK: 3 },
  });

  await testEndpoint('POST', '/api/v1/ai/knowledge', {
    testName: 'POST /api/v1/ai/knowledge (short query → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { query: 'x' },
  });

  await testEndpoint('POST', '/api/v1/ai/chat', {
    testName: 'POST /api/v1/ai/chat (empty messages → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { messages: [] },
  });

  await testEndpoint('POST', '/api/v1/ai/resume', {
    testName: 'POST /api/v1/ai/resume (short text → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { resumeText: 'Too short' },
  });

  await testEndpoint('POST', '/api/v1/ai/interview', {
    testName: 'POST /api/v1/ai/interview (invalid difficulty type → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { difficulty: 'invalid-difficulty-value' },
  });

  await testEndpoint('POST', '/api/v1/ai/recommend', {
    testName: 'POST /api/v1/ai/recommend (empty skills → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { skills: [], level: 'Beginner' },
  });

  await testEndpoint('POST', '/api/v1/ai/assess', {
    testName: 'POST /api/v1/ai/assess (invalid skill type → 400)',
    expectedStatus: 400,
    csrfToken,
    body: { skill: 123 },
  });

  await testEndpoint('POST', '/api/csp-report', {
    testName: 'POST /api/csp-report (valid report → 204)',
    expectedStatus: 204,
    csrfToken,
    body: { 'csp-report': { 'document-uri': 'https://zalvy.com', 'violated-directive': 'script-src', 'blocked-uri': 'https://evil.com/bad.js' } },
  });

  await testEndpoint('POST', '/api/vitals', {
    testName: 'POST /api/vitals (web vital → 204)',
    expectedStatus: 204,
    csrfToken,
    body: { name: 'LCP', value: 1234, rating: 'good', id: 'test-123' },
  });

  await testEndpoint('DELETE', '/api/v1/leads', {
    testName: 'DELETE /api/v1/leads (method not allowed)',
    acceptStatuses: [405, 403],
    csrfToken,
  });

  await testEndpoint('POST', '/api/v1/leads', {
    testName: 'POST /api/v1/leads WITHOUT CSRF → 403',
    expectedStatus: 403,
    body: { intent: 'enterprise', name: 'No CSRF', email: 'no@csrf.dev', message: 'No CSRF token attack test' },
  });

  console.log('\n========================================');
  console.log(`  Results: ${passCount} PASSED, ${failCount} FAILED / ${passCount + failCount} total`);
  console.log('========================================');

  if (failCount > 0) process.exit(1);
}

run();
