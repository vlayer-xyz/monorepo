import { beforeEach, describe, expect, it } from 'vitest';
import { updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';

import getStorageVerifier from '../../contracts/out/GetStorageUltraPLONKVerifier.sol/UltraVerifier.json';
import getStorage from '../../../target/get_storage.json';

import { readProofData } from './proofDataReader.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

export const abi = getStorage.abi as unknown as Abi;

describe('get_storage', async () => {
  let proof: Uint8Array;
  let inputMap: InputMap;
  const proofVerifier = await deploySolidityProofVerifier(getStorageVerifier as FoundryArtefact);

  beforeEach(async () => {
    ({ proof, inputMap } = await readProofData('get_storage'));
  });

  it('proof verification succeeds', async () => {
    const witnessMap = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMap)).toEqual(true);
  });

  it('proof fails: invalid storage value', async () => {
    updateNestedField(inputMap, ['return', 'values', '0', '0'], incHexStr);
    const witnessMapInvalidStorageValues = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMapInvalidStorageValues)).toEqual(false);
  });

  it('proof fails: invalid block hash', async () => {
    updateNestedField(inputMap, ['return', 'block_hash', '0'], incHexStr);
    const witnessMapInvalidBlockHash = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMapInvalidBlockHash)).toEqual(false);
  });
});
