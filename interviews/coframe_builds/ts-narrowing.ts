// Narrowing: a discriminated union of agent stream events, an exhaustive switch, and a guard that lies.
// Run the test: node --experimental-strip-types interviews/coframe_builds/ts-narrowing.test.ts

export type Ev =
  | { type: "text"; delta: string }
  | { type: "tool_call"; id: string; name: string; args: unknown }
  | { type: "done"; reason: "stop" | "length" };

export function assertNever(v: never): never {
  throw new Error("unhandled event " + JSON.stringify(v));
}

// Add a member to Ev and the default branch stops compiling: a to-do list from the compiler.
// At runtime the same branch catches an event a newer server sent that this build does not know.
export function render(e: Ev): string {
  switch (e.type) {
    case "text": return e.delta;
    case "tool_call": return `[${e.name}]`;
    case "done": return e.reason === "length" ? " (cut off)" : "";
    default: return assertNever(e);
  }
}

// A type predicate is an unchecked promise: this one only checks the tag, and tsc believes it.
export function isTextLoose(v: unknown): v is { type: "text"; delta: string } {
  return typeof v === "object" && v !== null && "type" in v && v.type === "text";
}

// An assertion function narrows the caller's variable after it returns.
export function assertString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new TypeError("expected a string, got " + typeof v);
}

export function typeDemos(): void {
  const xs = [1, undefined, 2].filter((x) => x !== undefined);
  const n: number[] = xs;                  // inferred as number[] since TS 5.5
  function f(v: string | number | Date | null): string {
    if (v === null) return "null";
    if (typeof v === "string") return v.toUpperCase();
    if (v instanceof Date) return v.toISOString();
    return v.toFixed(2);                   // v is number here
  }
  function g(e: Ev): string {
    switch (e.type) {
      case "text": return e.delta;
      case "done": return e.reason;
      // @ts-expect-error tool_call is not handled, so e is not never
      default: return assertNever(e);
    }
  }
  void [n, f, g];
}
