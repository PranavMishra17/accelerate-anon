// satisfies vs as, as const, readonly and branded ids: what each checks at compile time and what survives to runtime.
// Run the test: node --experimental-strip-types interviews/coframe_builds/ts-satisfies.test.ts

// satisfies checks the shape and keeps the literal keys, so a typo in a key is a compile error.
export const MODELS = {
  fast: { id: "small-1", maxTokens: 1024 },
  heavy: { id: "large-1", maxTokens: 8192 },
} satisfies Record<string, { id: string; maxTokens: number }>;
export type ModelKey = keyof typeof MODELS;                  // "fast" | "heavy"

// as const: a runtime array AND a union type, no enum needed. It does not freeze anything.
export const TOOL_NAMES = ["search", "fetch"] as const;
export type ToolName = (typeof TOOL_NAMES)[number];          // "search" | "fetch"
export function isToolName(s: string): s is ToolName {
  return (TOOL_NAMES as readonly string[]).includes(s);      // TOOL_NAMES.includes(s) does not compile
}

// Branded id: a string at runtime, a distinct type at compile time. The only cast lives here, behind a check.
type Brand<T, B extends string> = T & { readonly __brand: B };
export type RunId = Brand<string, "RunId">;
export type TenantId = Brand<string, "TenantId">;
export function RunId(s: string): RunId {
  if (!/^run_[a-z0-9]+$/.test(s)) throw new TypeError(`not a run id: ${s}`);
  return s as RunId;
}
export function cancelRun(id: RunId): string { return `cancelled ${id}`; }

// as is an assertion, not a conversion: the value is whatever JSON.parse produced.
export function retriesPlusOne(json: string): unknown {
  const cfg = JSON.parse(json) as { retries: number };
  return cfg.retries + 1;
}

// readonly is one-way and compile-time only: the original alias can still mutate.
export function readonlyAlias(): number {
  const arr = [1, 2];
  const ro: readonly number[] = arr;
  arr.push(3);
  return ro.length;
}

export function typeDemos(t: TenantId): void {
  const annotated: Record<string, { id: string; maxTokens: number }> = MODELS;
  const m = annotated.fsat;                // compiles: the annotation widened keys to string
  // @ts-expect-error satisfies kept the keys, so the typo is caught
  MODELS.fsat;
  // @ts-expect-error a plain string is not a RunId
  cancelRun("run_1");
  // @ts-expect-error a TenantId is not a RunId
  cancelRun(t);
  // @ts-expect-error string is not assignable to the element union
  TOOL_NAMES.includes("x" as string);
  const ro: readonly number[] = [1];
  // @ts-expect-error push does not exist on a readonly array
  ro.push(2);
  const lie = { a: 1 } as unknown as { b: string }; // double cast compiles: a review red flag
  void [m, lie];
}
