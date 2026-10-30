// Deep clone used to give each demo run a fresh, mutable copy of mock data
// without ever touching the original deterministic source (so Reset Demo is trivial).
export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}