// Generics and mapped types: a tool registry where a missing handler is a compile error, plus type-level checks.
// Run the test: node --experimental-strip-types interviews/coframe_builds/ts-generics.test.ts

// Each tool owns a parser from untrusted input to its args (zod schemas in real code).
function obj(raw: unknown): Record<string, unknown> {
  if (typeof raw !== "object" || raw === null) throw new TypeError("args must be an object");
  return raw as Record<string, unknown>;
}
const tools = {
  search: (raw: unknown) => {
    const q = obj(raw).query;
    if (typeof q !== "string") throw new TypeError("query must be a string");
    return { query: q };
  },
  run_tests: (raw: unknown) => {
    const { path, watch = false } = obj(raw);
    if (typeof path !== "string" || typeof watch !== "boolean") throw new TypeError("bad run_tests args");
    return { path, watch };
  },
};
type Tools = typeof tools;
export type ArgMap = { [K in keyof Tools]: ReturnType<Tools[K]> };
export type ToolCall = { [K in keyof ArgMap]: { name: K; args: ArgMap[K] } }[keyof ArgMap];
type Handlers = { [K in keyof ArgMap]: (args: ArgMap[K]) => Promise<string> };

// Leave out run_tests here and this object stops compiling.
const handlers: Handlers = {
  search: async ({ query }) => `searched ${query}`,
  run_tests: async ({ path, watch }) => `${path} watch=${watch}`,
};

export function isToolName(s: string): s is keyof Tools { return Object.hasOwn(tools, s); }

// Generic over K: TS relates handlers[name] to ArgMap[K]. One cast at the seam, where the parser runs.
export async function dispatch<K extends keyof Tools>(name: K, raw: unknown): Promise<string> {
  const args = tools[name](raw) as ArgMap[K];
  return handlers[name](args);
}

// Type-level tests: Expect<Equal<A, B>> fails to compile unless A and B are the same type.
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;

export type ElementOf<T> = T extends readonly (infer E)[] ? E : never;
export type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;
export type ToArr<T> = T extends unknown ? T[] : never;          // naked T: distributes over a union
export type NonDist<T> = [T] extends [unknown] ? T[] : never;     // wrapped: no distribution
export type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
export type ParseRoute<S extends string> =
  S extends `${string}:${infer P}/${infer Rest}` ? P | ParseRoute<`/${Rest}`>
  : S extends `${string}:${infer P}` ? P : never;

export function over(x: string): string;
export function over(x: number): number;
export function over(x: string | number): string | number { return x; }

export type Checks = [
  Expect<Equal<ElementOf<string[]>, string>>,
  Expect<Equal<Unwrap<Promise<Promise<number>>>, number>>,
  Expect<Equal<ToArr<string | number>, string[] | number[]>>,
  Expect<Equal<NonDist<string | number>, (string | number)[]>>,
  Expect<Equal<Getters<{ name: string }>, { getName: () => string }>>,
  Expect<Equal<ParseRoute<"/users/:id/jobs/:jobId">, "id" | "jobId">>,
  Expect<Equal<ReturnType<typeof over>, number>>,            // overloads: the last one wins
  Expect<Equal<ToolCall, { name: "search"; args: { query: string } } | { name: "run_tests"; args: { path: string; watch: boolean } }>>,
];

export function typeDemos(call: ToolCall): void {
  // @ts-expect-error correlated union: TS cannot tie call.name to call.args across the union
  handlers[call.name](call.args);

  function tuple<const T extends readonly unknown[]>(xs: T): T { return xs; }  // TS 5.0
  const t: readonly ["a", 1] = tuple(["a", 1]);
  function pick<T extends string>(opts: T[], def?: NoInfer<T>): T | undefined { return def ?? opts[0]; } // TS 5.4
  // @ts-expect-error "c" is not one of the inferred options
  pick(["a", "b"], "c");
  void t;
}
