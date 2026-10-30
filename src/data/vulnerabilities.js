import { SEVERITY } from '../constants/severity';
import { VULN_STATE, CANDIDATE_STATUS } from '../constants/status';

/**
 * EXACTLY THREE tracked vulnerabilities, matching the required demo scope.
 * `status` and `stateHistory` are mutated at runtime by the pipeline engine
 * (Step 3) on a cloned copy — this file is the deterministic source.
 */
export const VULNERABILITIES = [
  {
    id: 'vuln-headers-001',
    ruleId: 'CG-RULE-SEC-HEADERS-01',
    type: 'Missing Security Headers',
    severity: SEVERITY.MEDIUM,
    location: 'GET /api/products (all API routes)',
    status: VULN_STATE.DETECTED,
    stateHistory: [{ state: VULN_STATE.DETECTED, timestamp: null, actor: 'cyberguard-scanner' }],
    evidence: {
      targetUrl: 'https://sandbox-7e21f9a.cyberguard.local/api/products',
      method: 'GET',
      parameter: null,
      request: [
        'GET /api/products HTTP/1.1',
        'Host: sandbox-7e21f9a.cyberguard.local',
        'Accept: application/json',
        'User-Agent: CyberGuard-Scanner/1.0 (Simulated Demo Mode)',
      ].join('\n'),
      responseExcerpt: [
        'HTTP/1.1 200 OK',
        'Content-Type: application/json; charset=utf-8',
        'X-Powered-By: Express',
        'Date: <runtime>',
      ].join('\n'),
      offendingContent:
        'Response headers do not include X-Content-Type-Options, Content-Security-Policy, Strict-Transport-Security, or Referrer-Policy.',
      observedHeaders: [
        { name: 'Content-Type', value: 'application/json; charset=utf-8', present: true },
        { name: 'X-Content-Type-Options', value: null, present: false },
        { name: 'Content-Security-Policy', value: null, present: false },
        { name: 'Strict-Transport-Security', value: null, present: false },
        { name: 'Referrer-Policy', value: null, present: false },
      ],
      expectedHeaders: [
        { name: 'X-Content-Type-Options', value: 'nosniff' },
        { name: 'Content-Security-Policy', value: "default-src 'self'" },
        { name: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
      sourceFile: 'server/middleware/security.js',
      sourceLine: 14,
      detectionRule: 'CG-RULE-SEC-HEADERS-01',
      timestamp: null,
      validationStatus: 'VALIDATED — confirmed by direct inspection of live HTTP response headers.',
    },
    ai: {
      explanation:
        'The application responds to all API requests without four standard security headers. These headers instruct browsers how to safely handle the response, restrict content sources, and enforce transport security.',
      impact:
        'Without these headers, browsers fall back to permissive defaults. This increases exposure to MIME-sniffing attacks, clickjacking, protocol downgrade attacks, and makes exploitation of other issues (like reflected XSS) easier to weaponize.',
      remediation:
        'Add a centralized security headers middleware (e.g., Helmet for Express) applied globally before route handlers, setting all four missing headers with safe defaults.',
      verificationCriteria:
        'Re-scan must show all four headers present on the same endpoint, with values matching policy, before this finding can move to VERIFIED.',
      simpleExplanation:
        "Think of these headers as safety instructions a website gives your browser. Right now VulnShop isn't giving any of them, so the browser defaults to the least safe behavior.",
      cannedReplies: [
        {
          q: 'Why does this matter if there’s no data leak?',
          a: 'Missing headers don’t leak data by themselves, but they remove defensive layers. They make other vulnerabilities — like the reflected XSS also found in this scan — significantly easier to exploit in a real browser.',
        },
        {
          q: 'Is this evidence-based or just an AI guess?',
          a: 'Evidence-based. This explanation is generated strictly from the captured response headers shown in the Evidence tab. I do not introduce findings — I only explain what was already detected and validated.',
        },
        {
          q: 'What would confirm this is actually fixed?',
          a: 'A re-scan of the same endpoint showing all four headers present with safe values. A code change alone is not proof — only a passing re-scan is.',
        },
      ],
    },
    fix: {
      file: 'server/middleware/security.js',
      before: `const express = require('express');
const router = express.Router();

// No centralized security headers applied
module.exports = router;`,
      after: `const express = require('express');
const helmet = require('helmet');
const router = express.Router();

router.use(
  helmet({
    contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
    hsts: { maxAge: 63072000, includeSubDomains: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

module.exports = router;`,
    },
  },

  {
    id: 'vuln-cookies-002',
    ruleId: 'CG-RULE-COOKIE-01',
    type: 'Insecure Cookies',
    severity: SEVERITY.HIGH,
    location: 'POST /api/auth/login — Set-Cookie: session',
    status: VULN_STATE.DETECTED,
    stateHistory: [{ state: VULN_STATE.DETECTED, timestamp: null, actor: 'cyberguard-scanner' }],
    evidence: {
      targetUrl: 'https://sandbox-7e21f9a.cyberguard.local/api/auth/login',
      method: 'POST',
      parameter: 'session (cookie)',
      request: [
        'POST /api/auth/login HTTP/1.1',
        'Host: sandbox-7e21f9a.cyberguard.local',
        'Content-Type: application/json',
        '',
        '{ "email": "demo@vulnshop.local", "password": "••••••••" }',
      ].join('\n'),
      responseExcerpt: [
        'HTTP/1.1 200 OK',
        'Content-Type: application/json; charset=utf-8',
        'Set-Cookie: session=eyJhbGciOiJIUzI1NiJ9.demoPayload.sig; Path=/',
      ].join('\n'),
      offendingContent: 'Set-Cookie: session=eyJhbGciOiJIUzI1NiJ9.demoPayload.sig; Path=/',
      observedSetCookie: 'session=eyJhbGciOiJIUzI1NiJ9.demoPayload.sig; Path=/',
      expectedSetCookie:
        'session=eyJhbGciOiJIUzI1NiJ9.demoPayload.sig; Path=/; Secure; HttpOnly; SameSite=Strict',
      missingAttributes: ['Secure', 'HttpOnly', 'SameSite'],
      sourceFile: 'server/routes/auth.js',
      sourceLine: 42,
      detectionRule: 'CG-RULE-COOKIE-01',
      timestamp: null,
      validationStatus: 'VALIDATED — confirmed by inspecting the raw Set-Cookie header on login response.',
    },
    ai: {
      explanation:
        'The session cookie issued after login is missing the Secure, HttpOnly, and SameSite attributes. These flags control whether a cookie can be sent over plain HTTP, read by client-side scripts, or sent with cross-site requests.',
      impact:
        'Without Secure, the cookie could be transmitted over an unencrypted connection. Without HttpOnly, it is readable by JavaScript — making it a direct target for theft via XSS. Without SameSite, it can be sent in cross-site requests, enabling CSRF.',
      remediation:
        'Set cookie options explicitly when issuing the session cookie: Secure: true, httpOnly: true, sameSite: "strict".',
      verificationCriteria:
        'Re-scan must show the Set-Cookie header on the login response containing Secure, HttpOnly, and SameSite=Strict before this finding can move to VERIFIED.',
      simpleExplanation:
        'This cookie is like a house key handed over with no lock instructions — it can be copied by scripts, sent over insecure channels, or used by other sites without permission.',
      cannedReplies: [
        {
          q: 'How does this combine with the XSS finding?',
          a: 'Without HttpOnly, a successful XSS payload could read this cookie directly with document.cookie and exfiltrate it. Fixing both findings together closes that chain.',
        },
        {
          q: 'Does SameSite alone fix this?',
          a: 'No — SameSite mitigates CSRF, but Secure and HttpOnly address separate risks (transport exposure and script access). All three attributes are required together.',
        },
        {
          q: 'What proves this is resolved?',
          a: 'A re-scan showing the Set-Cookie header on the same login endpoint with all three attributes present — not just a code diff.',
        },
      ],
    },
    fix: {
      file: 'server/routes/auth.js',
      before: `router.post('/login', async (req, res) => {
  const token = signSession(req.body);
  res.cookie('session', token, { path: '/' });
  res.json({ ok: true });
});`,
      after: `router.post('/login', async (req, res) => {
  const token = signSession(req.body);
  res.cookie('session', token, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
  res.json({ ok: true });
});`,
    },
  },

  {
    id: 'vuln-xss-003',
    ruleId: 'CG-RULE-XSS-01',
    type: 'Controlled Reflected XSS',
    severity: SEVERITY.CRITICAL,
    location: 'GET /search?q=',
    status: VULN_STATE.DETECTED,
    stateHistory: [{ state: VULN_STATE.DETECTED, timestamp: null, actor: 'cyberguard-scanner' }],
    evidence: {
      targetUrl: 'https://sandbox-7e21f9a.cyberguard.local/search',
      method: 'GET',
      parameter: 'q',
      testInput: `<script>alert('cyberguard-demo-xss')</script>`,
      request: [
        'GET /search?q=%3Cscript%3Ealert(%27cyberguard-demo-xss%27)%3C%2Fscript%3E HTTP/1.1',
        'Host: sandbox-7e21f9a.cyberguard.local',
        'User-Agent: CyberGuard-Scanner/1.0 (Simulated Demo Mode)',
      ].join('\n'),
      responseExcerpt: [
        'HTTP/1.1 200 OK',
        'Content-Type: text/html; charset=utf-8',
        '',
        '<div class="search-results">',
        '  <p>Showing results for: <script>alert(\'cyberguard-demo-xss\')</script></p>',
        '</div>',
      ].join('\n'),
      offendingContent: `<p>Showing results for: <script>alert('cyberguard-demo-xss')</script></p>`,
      reflection: 'Payload reflected verbatim, unescaped, inside an executable <script> context.',
      sourceFile: 'server/routes/search.js',
      sourceLine: 27,
      detectionRule: 'CG-RULE-XSS-01',
      timestamp: null,
      validationStatus:
        'VALIDATED — controlled payload with unique marker reflected unescaped in live response (confirmed, not merely signature-matched).',
    },
    ai: {
      explanation:
        'The /search endpoint reflects the "q" query parameter directly into the HTML response without encoding or sanitization. A controlled, non-destructive payload containing a unique marker was reflected verbatim inside a script-executable context.',
      impact:
        'An attacker can craft a link containing malicious script in the "q" parameter. If a victim opens it, the script executes in their browser session — enabling session token theft, UI manipulation, or further attacks, especially combined with the insecure cookie finding.',
      remediation:
        'HTML-encode all user-controlled output before rendering, or use a templating engine with automatic contextual escaping. Never interpolate raw request parameters into HTML strings.',
      verificationCriteria:
        'Re-scan must replay the exact same payload against the fixed endpoint and confirm it is rendered as inert, encoded text — not executed — before this finding can move to VERIFIED.',
      simpleExplanation:
        'The search page repeats back whatever you type, without checking if it’s safe. If you type in a small script instead of a search term, the page runs it instead of just displaying it.',
      cannedReplies: [
        {
          q: 'How do we know this is a real reflection and not a guess?',
          a: 'The Evidence tab shows the exact request sent and the exact response received, with the unique marker "cyberguard-demo-xss" visible unescaped in the HTML. That is direct proof, not an inference.',
        },
        {
          q: 'Could this payload have done real damage?',
          a: 'No — this is a non-destructive, controlled payload (an alert with a demo marker) used only to prove reflection safely. No actual exploitation occurred, consistent with Simulated Demo Mode and authorized testing.',
        },
        {
          q: 'What exactly will the fix change?',
          a: 'It replaces direct string interpolation with HTML-encoded output, so special characters like < and > are rendered as text instead of being parsed as markup. See the Fix tab for the before/after diff.',
        },
      ],
    },
    fix: {
      file: 'server/routes/search.js',
      before: `router.get('/search', (req, res) => {
  const q = req.query.q || '';
  res.send(\`
    <div class="search-results">
      <p>Showing results for: \${q}</p>
    </div>
  \`);
});`,
      after: `const { encode } = require('html-entities');

router.get('/search', (req, res) => {
  const q = encode(req.query.q || '');
  res.send(\`
    <div class="search-results">
      <p>Showing results for: \${q}</p>
    </div>
  \`);
});`,
    },
  },
];

/**
 * Candidate findings the scanner flagged but which FAILED validation —
 * demonstrates that raw scanner signal is not an automatic confirmed vulnerability.
 */
export const REJECTED_CANDIDATES = [
  {
    id: 'candidate-sqli-001',
    type: 'Potential SQL Injection',
    severity: SEVERITY.HIGH,
    location: 'GET /api/reports?range=',
    status: CANDIDATE_STATUS.REJECTED_CANDIDATE,
    reason:
      'The "range" parameter is strictly typed as an enum and passed through a parameterized query. The scanner signature matched on keyword heuristics, but the live request could not reproduce any injection behavior.',
  },
  {
    id: 'candidate-jquery-001',
    type: 'Outdated jQuery Version Detected',
    severity: SEVERITY.LOW,
    location: 'GET /assets/vendor/jquery-2.1.4.min.js',
    status: CANDIDATE_STATUS.REJECTED_CANDIDATE,
    reason:
      'Version signature matched a known-vulnerable release, but manual validation found no reachable code path that exercises the vulnerable function in this application.',
  },
];