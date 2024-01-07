import { expect } from 'vitest';

export function expectCircuitFail(p: Promise<boolean>) {
  expect(p).rejects.toThrow(
    'Circuit execution failed: Error: Failed to solve brillig function, reason: explicit trap hit in brillig'
  );
}
