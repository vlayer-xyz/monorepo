import { readFile } from 'fs/promises';
import { AccountWithProof } from "../src/noir/oracles/accountOracles.js";
import { expect } from 'vitest';

export async function loadAccountWithProof(name: string): Promise<AccountWithProof> {
  return JSON.parse(await readFile(`./test/resources/${name}`, 'utf-8')) as AccountWithProof;
}

export function expectCircuitFail(p: Promise<any>) {
  expect(p).rejects.toThrow(
    'Circuit execution failed: Error: Failed to solve brillig function, reason: explicit trap hit in brillig',
  );
}
