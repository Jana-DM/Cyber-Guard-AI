export const PROJECT = {
  name: 'VulnShop Demo',
  description:
    'Authorized mock e-commerce application used exclusively for CyberGuard AI demonstrations.',
  repository: {
    provider: 'GitHub',
    fullName: 'cyberguard-demo/vulnshop',
    url: 'https://github.com/cyberguard-demo/vulnshop',
    defaultBranch: 'main',
  },
  // "main" is deliberately excluded from remediation-eligible branches everywhere in the UI.
  branches: ['main', 'develop', 'release/2.4', 'feature/checkout-v2'],
  remediationEligibleBranches: ['develop', 'release/2.4', 'feature/checkout-v2'],
  target: {
    label: 'VulnShop Demo (Authorized Mock Target)',
    baseUrl: 'https://vulnshop-demo.cyberguard.local',
  },
};