// Structural typing: compatibility is by shape, so a value typed Point can carry extra keys at runtime.
// Run the test: node --experimental-strip-types interviews/coframe_builds/ts-structural.test.ts

export interface Point { x: number; y: number }

export function norm(p: Point): number { return Math.hypot(p.x, p.y); }

// The parameter says Point; the JSON says whatever the object really holds.
export function serialise(p: Point): string { return JSON.stringify(p); }

// Copy the declared keys when the shape must be exact (logs, storage, a prompt).
export function exactPoint(p: Point): Point { return { x: p.x, y: p.y }; }

// Object.keys is string[] by design; cast once, in a helper, only for objects you own.
export function keysOf<T extends object>(o: T): (keyof T)[] { return Object.keys(o) as (keyof T)[]; }

// Never called: tsc checks these lines (each @ts-expect-error must be a real error).
export function typeDemos(): void {
  const p3 = { x: 1, y: 2, z: 3 };
  const ok: Point = p3;                    // fine: not a fresh literal, no excess property check
  // @ts-expect-error excess property check fires only on a fresh object literal
  const bad: Point = { x: 1, y: 2, z: 3 };

  interface Opts { retries?: number; timeoutMs?: number }
  const typo = { retry: 3 };
  // @ts-expect-error weak type detection: all-optional target, no property in common
  const w: Opts = typo;

  const ks = Object.keys(ok);              // string[]
  // @ts-expect-error a string cannot index Point
  ok[ks[0]!];

  class Usd { cents = 0 }
  class Eur { cents = 0 }
  const e: Eur = new Usd();                // compiles: same shape, names do not matter

  class A { private k = 0 }
  class B { private k = 0 }
  // @ts-expect-error private members make classes nominal
  const b: B = new A();
  void [bad, w, e, b];
}
