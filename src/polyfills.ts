import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
  (window as any).process = { 
    env: {},
    browser: true,
    version: '',
    nextTick: (fn: Function) => setTimeout(fn, 0)
  };
}
