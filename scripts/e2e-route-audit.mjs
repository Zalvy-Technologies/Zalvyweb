// scripts/e2e-route-audit.mjs
import http from 'node:http';

const BASE = 'http://localhost:3000';

const routes = [
  '/',
  '/about',
  '/agents',
  '/automation',
  '/blog',
  '/careers',
  '/careers/bench',
  '/careers/internship',
  '/careers/senior-staff-agent-systems',
  '/changelog',
  '/contact',
  '/legal/dpa',
  '/legal/privacy',
  '/legal/terms',
  '/login',
  '/platform',
  '/platform/agents',
  '/platform/automation',
  '/platform/chatbots',
  '/platform/inference',
  '/platform/studio',
  '/platform/tools',
  '/pricing',
  '/projects',
  '/search',
  '/security',
  '/services',
  '/solutions',
  '/studio',
  '/studio/notes',
  '/studio/oss',
  '/studio/process',
  '/studio/work',
  '/studio/work/helios-agent-routing',
  '/studio/work/quanta-research-ops',
  '/studio/work/aperture-inference',
  '/verify',
  '/admin',
  '/admin/activity',
  '/admin/ai',
  '/admin/applications',
  '/admin/audit-logs',
  '/admin/blog',
  '/admin/certificates',
  '/admin/email-templates',
  '/admin/logs',
  '/admin/notifications',
  '/admin/projects',
  '/admin/roles',
  '/admin/settings',
  '/admin/users',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest'
];

async function fetchRoute(path) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { headers: { 'Accept': 'text/html,application/json,*/*' } });
    const text = await res.text();
    return {
      path,
      status: res.status,
      ok: res.ok,
      hasHtml: text.includes('<html') || text.includes('<?xml') || text.includes('{') || text.includes('User-agent'),
      hasError: text.includes('Internal Server Error') || text.includes('Application error') || text.includes('Unhandled Runtime Error'),
      length: text.length
    };
  } catch (err) {
    return {
      path,
      status: 0,
      ok: false,
      error: err.message
    };
  }
}

async function run() {
  console.log(`Starting Route Audit for ${routes.length} routes...`);
  const results = [];
  let failCount = 0;

  for (const r of routes) {
    const res = await fetchRoute(r);
    results.push(res);
    if (!res.ok || res.hasError) {
      console.error(`❌ FAIL: ${r} - Status ${res.status}, Error: ${res.hasError ? 'Runtime Error in body' : 'HTTP error'}`);
      failCount++;
    } else {
      console.log(`✅ PASS: ${r} (${res.status}) - ${res.length} bytes`);
    }
  }

  console.log('\n--- Route Audit Summary ---');
  console.log(`Total Tested: ${routes.length}`);
  console.log(`Passed: ${routes.length - failCount}`);
  console.log(`Failed: ${failCount}`);

  if (failCount > 0) {
    process.exit(1);
  }
}

run();
