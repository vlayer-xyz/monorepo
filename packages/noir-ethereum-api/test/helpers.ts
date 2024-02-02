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

export interface AccountWithProof {
  nonce: string;
  balance: string;
  codeHash: string[];
  storageHash: string[];
  key: string[];
  value: string[];
  proof: string[];
  depth: string;
}

export function serializeAccountWithProof(account: AccountWithProof): ForeignCallOutput[] {
  return [
    account.nonce,
    account.balance,
    account.storageHash,
    account.codeHash,
    account.key,
    account.value,
    account.proof,
    account.depth
  ];
}
