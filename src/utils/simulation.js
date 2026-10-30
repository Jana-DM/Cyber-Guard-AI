export class CancelledError extends Error {
  constructor() {
    super('Simulation run was cancelled');
    this.name = 'CancelledError';
  }
}

/**
 * Creates an isolated, cancelable async run controller.
 * Each "Run Demo" press creates a new controller.
 * cancel() immediately rejects any in-flight sleep() promise AND clears
 * its timer — this is what lets Reset Demo stop a run instantly instead
 * of leaving the async pipeline function stuck awaiting a timer that
 * will never fire.
 */
export function createRunController() {
  let cancelled = false;
  const pending = new Set(); // { timeoutId, reject }

  function sleep(ms) {
    return new Promise((resolve, reject) => {
      if (cancelled) {
        reject(new CancelledError());
        return;
      }
      const entry = { timeoutId: null, reject };
      entry.timeoutId = setTimeout(() => {
        pending.delete(entry);
        resolve();
      }, ms);
      pending.add(entry);
    });
  }

  function cancel() {
    if (cancelled) return;
    cancelled = true;
    pending.forEach((entry) => {
      clearTimeout(entry.timeoutId);
      entry.reject(new CancelledError());
    });
    pending.clear();
  }

  function isCancelled() {
    return cancelled;
  }

  return { sleep, cancel, isCancelled };
}

export function sumDuration(logs) {
  return logs.reduce((acc, l) => acc + l.delay, 0);
}