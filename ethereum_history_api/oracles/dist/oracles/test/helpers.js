import { expect } from 'vitest';
export async function expectCircuitFail(p) {
    await expect(p).rejects.toThrow('Circuit execution failed: Error: Failed to solve brillig function, reason: explicit trap hit in brillig');
}
export function serializeAccount(account) {
    return [account.nonce, account.balance, account.storageHash, account.codeHash];
}
export function serializeStateProof(account) {
    return [account.key, account.value, account.proof, account.depth];
}
