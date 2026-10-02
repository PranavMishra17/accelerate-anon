// Validation at the boundary: tool args from a model are unknown until parsed; failures become is_error tool results.
// Run the test: node --experimental-strip-types interviews/coframe_builds/ts-boundary.test.ts
import { toError } from "./ts-unknown.ts";

export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// In real code this is z.object({ query: z.string().min(1), limit: z.number().int().min(1).max(50).default(10) })
// with type SearchArgs = z.infer<typeof SearchArgs>. Hand-written here (standard library only); stops at the first problem.
export type SearchArgs = { query: string; limit: number };
export function parseSearchArgs(raw: unknown): Result<SearchArgs> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return err("arguments must be an object");
  const { query, limit = 10 } = raw as { query?: unknown; limit?: unknown };
  if (typeof query !== "string" || query.length === 0) return err("query: expected a non-empty string");
  if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 50)
    return err("limit: expected an integer from 1 to 50");
  return ok({ query, limit });             // a new object: unknown keys are stripped, like z.object
}

export type ToolResult = { type: "tool_result"; tool_use_id: string; content: string; is_error?: true };

// A tool failure is data for the model, not a crash of the loop.
export async function runSearchTool(
  id: string,
  input: unknown,
  run: (a: SearchArgs) => Promise<string>,
): Promise<ToolResult> {
  const parsed = parseSearchArgs(input);
  if (!parsed.ok) return { type: "tool_result", tool_use_id: id, content: `Invalid arguments: ${parsed.error}`, is_error: true };
  try {
    return { type: "tool_result", tool_use_id: id, content: await run(parsed.value) };
  } catch (e) {
    return { type: "tool_result", tool_use_id: id, content: toError(e).message, is_error: true };
  }
}
