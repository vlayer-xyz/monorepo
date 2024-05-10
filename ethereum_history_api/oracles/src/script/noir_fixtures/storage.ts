import { GetProofReturnType } from 'viem';
import { encodeHexString, joinArray, joinArrayVertical } from '../../noir/noir_js/encode.js';
import { encodeBytes32 } from '../../noir/oracles/common/encode.js';

export function createStorageFixture(stateProof: GetProofReturnType): string {
  const values = stateProof.storageProof.map((storageProof) => {
    return joinArray(encodeBytes32(storageProof.value));
  });

  const keys = stateProof.storageProof.map((storageProof) => {
    return joinArray(encodeHexString(storageProof.key));
  });

  const storageFixture = `global keys = ${joinArrayVertical(keys)};

global values = ${joinArrayVertical(values)};
`;
  return storageFixture;
}
