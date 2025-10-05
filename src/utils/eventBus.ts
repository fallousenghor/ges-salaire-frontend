type Listener = (...args: unknown[]) => void;

const listeners: Record<string, Set<Listener>> = {};

export function on(event: string, cb: Listener) {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(cb);
  return () => off(event, cb);
}

export function off(event: string, cb: Listener) {
  if (!listeners[event]) return;
  listeners[event].delete(cb);
  if (listeners[event].size === 0) delete listeners[event];
}

export function emit(event: string, ...args: unknown[]) {
  if (!listeners[event]) return;
  // copy to avoid mutation during iteration
  Array.from(listeners[event]).forEach((cb) => {
    try {
      cb(...args);
    } catch {
      // ignore listener errors
    }
  });
}

export default { on, off, emit };
