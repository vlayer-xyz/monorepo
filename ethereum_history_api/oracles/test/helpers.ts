import { expect } from 'vitest';
import { ForeignCallOutput } from '@noir-lang/noir_js';

export async function expectCircuitFail(p: Promise<boolean>): Promise<void> {
  await expect(p).rejects.toThrow(
    'Circuit execution failed: Error: Failed to solve brillig function, reason: explicit trap hit in brillig'
  );
}

export type FieldsOfType<ObjectType, FieldType> = {
  [K in keyof ObjectType]: ObjectType[K] extends FieldType ? K : never;
}[keyof ObjectType];

export interface Account {
  nonce: string;
  balance: string;
  codeHash: string[];
  storageHash: string[];
}

export interface AccountStateProof {
  key: string[];
  value: string[];
  proof: string[];
  depth: string;
}

export function serializeAccount(account: Account): ForeignCallOutput[] {
  return [account.nonce, account.balance, account.storageHash, account.codeHash];
}

export function serializeStateProof(account: AccountStateProof): ForeignCallOutput[] {
  return [account.key, account.value, account.proof, account.depth];
}
