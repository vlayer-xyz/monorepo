import { expect } from 'vitest';

export async function expectCircuitFail(p: Promise<boolean>): Promise<void> {
  await expect(p).rejects.toThrow(
    'Circuit execution failed: Error: Failed to solve brillig function, reason: explicit trap hit in brillig'
  );
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export type FieldsOfType<ObjectType, FieldType> = {
  [K in keyof ObjectType]: ObjectType[K] extends FieldType ? K : never;
}[keyof ObjectType];
