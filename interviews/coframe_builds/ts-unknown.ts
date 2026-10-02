// any, unknown and never: unknown at every boundary, never for code that cannot return.
// Run the test: node --experimental-strip-types interviews/coframe_builds/ts-unknown.test.ts

// JSON.parse returns any; wrap it so callers get unknown and must narrow.
export function parseJson(s: string): unknown { return JSON.parse(s); }

// Anything can be thrown (strings included), so normalise before reading .message.
export function toError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

export function fail(msg: string): never { throw new Error(msg); }

// any is contagious: everything read from it is any, so nothing below is checked.
export function countFromAny(s: string): number {
  const a: any = JSON.parse(s);
  const n: number = a.count;               // compiles even when count is missing
  return n + 1;
}

// unknown forces the check before use.
export function countFromUnknown(s: string): number {
  const u = parseJson(s);
  if (typeof u === "object" && u !== null && "count" in u && typeof u.count === "number") return u.count + 1;
  return fail("count missing");
}

export function typeDemos(): void {
  const u: unknown = parseJson("{}");
  // @ts-expect-error unknown cannot be used without narrowing
  u.foo;
  const x: string = Math.random() > 2 ? "a" : fail("nope"); // never is assignable to every type
  try { fail("x"); } catch (e) {
    // @ts-expect-error with strict, the catch variable is unknown
    e.message;
  }
  void x;
}
