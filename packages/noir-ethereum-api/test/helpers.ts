import { expect } from 'vitest';
import { ForeignCallOutput } from '@noir-lang/noir_js';
import * as os from 'os';
import * as fs from 'fs/promises';
import packgeJson from '../package.json';

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

export interface AccountWithProof {
  balance: string;
  codeHash: string[];
  nonce: string;
  key: string[];
  value: string[];
  proof: string[];
  depth: string;
}

export function serializeAccountWithProof(account: AccountWithProof): ForeignCallOutput[] {
  return [account.balance, account.codeHash, account.nonce, account.key, account.value, account.proof, account.depth];
}

export async function withTempFile<T>(callback: (path: string) => Promise<T>): Promise<T> {
  const testTempDir = await fs.mkdtemp(`${os.tmpdir()}/${packgeJson.name}-temp-dir-`);
  const tempFilePath = `${testTempDir}/temp-${Date.now()}.json`;
  try {
    return await callback(tempFilePath);
  } finally {
    await fs.unlink(tempFilePath);
    await fs.rmdir(testTempDir);
  }
}
