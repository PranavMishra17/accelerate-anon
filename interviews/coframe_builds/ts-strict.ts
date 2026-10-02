// Where the type system is unsound on purpose: method bivariance, array covariance, narrowing kept across calls.
// Run the test: node --experimental-strip-types interviews/coframe_builds/ts-strict.test.ts
// Typecheck with strict, noUncheckedIndexedAccess and exactOptionalPropertyTypes on.

export class Animal { name = "a" }
export class Dog extends Animal { bark(): string { return "woof"; } }

interface MethodStyle<T> { handle(x: T): string }      // method syntax: parameters stay bivariant
interface PropStyle<T> { handle: (x: T) => string }     // function-typed property: checked contravariantly

const dogMethod: MethodStyle<Dog> = { handle: (d) => d.bark() };
export const animalMethod: MethodStyle<Animal> = dogMethod; // compiles, and is wrong

// Arrays are covariant: a Dog[] seen as Animal[] accepts any Animal.
export function covariantArrays(): string {
  const dogs: Dog[] = [];
  const animals: Animal[] = dogs;
  animals.push(new Animal());
  return dogs[0]!.bark();
}

// Narrowing on a property survives a call that changes it: tsc assumes calls do not mutate.
export function narrowingAcrossCalls(): number {
  const box: { v: string | null } = { v: "x" };
  const clear = () => { box.v = null; };
  if (box.v !== null) {
    clear();
    return box.v.length;                   // compiles, throws
  }
  return 0;
}

export function typeDemos(): void {
  const dogProp: PropStyle<Dog> = { handle: (d) => d.bark() };
  // @ts-expect-error strictFunctionTypes: a Dog handler cannot stand in for an Animal handler
  const animalProp: PropStyle<Animal> = dogProp;

  const counts: Record<string, number> = {};
  // @ts-expect-error noUncheckedIndexedAccess: counts["x"] is number | undefined
  counts["x"].toFixed();
  const first = [1, 2][0];
  const n: number = first ?? 0;            // the flag makes you handle the empty case

  interface Patch { title?: string }
  // @ts-expect-error exactOptionalPropertyTypes: absent is allowed, an explicit undefined is not
  const p: Patch = { title: undefined };

  const f: () => void = () => 42;          // compiles: a void-returning type accepts any return
  void [animalProp, n, p, f];
}
