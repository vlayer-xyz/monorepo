import { GetProofReturnType } from 'viem';
import { encodeHexString, joinArray, joinArrayVertical } from '../../noir/noir_js/encode.js';

export function createStorageFixture(stateProof: GetProofReturnType): string {
  const keys = stateProof.storageProof.map((storageProof) => {
    return joinArray(encodeHexString(storageProof.key));
  });
  const storageFixture = `
global keys = ${joinArrayVertical(keys)};
`;
  return storageFixture;
}
