export const GITHUB_WORKFLOW = {
  branch: 'cyberguard/fix-xss-001',
  baseBranch: 'feature/checkout-v2', // never "main"
  commitMessage:
    'fix(security): sanitize reflected XSS in /search query parameter\n\nCyberGuard AI — Simulated Demo Mode\nFinding: CG-RULE-XSS-01\nVerification: re-scan confirmed payload no longer reflects unescaped.',
  commitHashShort: 'a93f1c2',
  commitHashFull: 'a93f1c2e7b4d5f0918273645ab6c7d8e9f0a1b2c',
  prTitle: 'Fix: Controlled Reflected XSS in search endpoint (CyberGuard AI)',
  prChecks: [
    { id: 'install', label: 'Install dependencies' },
    { id: 'build', label: 'Build' },
    { id: 'test', label: 'Run test suite' },
    { id: 'rescan', label: 'Security re-scan' },
  ],
};