import { ForeignCallOutput } from '@noir-lang/noir_js';

export interface Account {
  nonce: string;
  balance: string;
  codeHash: string[];
  storageRoot: string[];
}

export interface AccountStateProof {
  key: string[];
  value: string[];
  proof: string[];
  depth: string;
}

export function serializeAccount(account: Account): ForeignCallOutput[] {
  return [account.nonce, account.balance, account.storageRoot, account.codeHash];
}

export function serializeStateProof(account: AccountStateProof): ForeignCallOutput[] {
  return [account.key, account.value, account.proof, account.depth];
}
