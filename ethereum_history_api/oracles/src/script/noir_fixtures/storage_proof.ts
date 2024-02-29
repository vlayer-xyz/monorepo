import { Hash } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeProof } from '../../noir/oracles/accountOracles.js';

type StorageProof = {
  key: Hash;
  proof: Hash[];
  value: bigint;
};

export function createStorageProofFixture(storageProof: StorageProof): string {
  const key = encodeHexString(storageProof.key);
  const value = '0x' + storageProof.value.toString(16);
  const proof = encodeProof(storageProof.proof).map((byte) => parseInt(byte, 16));
  const depth = storageProof.proof.length;
  const storageProofFixture = `
global key = [
    ${key}
];
global value = [
    ${value}
];
global proof = [
    ${proof}
];
global depth = ${depth};
`;
  return storageProofFixture;
}
