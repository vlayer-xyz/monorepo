import { beforeEach, describe, expect, it } from 'vitest';
import { updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';

import getHeaderVerifier from '../../contracts/out/GetHeaderUltraPLONKVerifier.sol/UltraVerifier.json';
import getHeader from '../../../target/get_header.json';

import { readProofData } from './proofDataReader.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

export const abi = getHeader.abi as unknown as Abi;

describe('get_header', async () => {
  let proof: Uint8Array;
  let inputMap: InputMap;
  const proofVerifier = await deploySolidityProofVerifier(getHeaderVerifier as FoundryArtefact);

  beforeEach(async () => {
    ({ proof, inputMap } = await readProofData('get_header'));
  });

  it('proof verification successes', async () => {
    const witnessMap = abiEncode(abi, inputMap, inputMap['return']);
    expect(await proofVerifier.verify(proof, witnessMap)).toEqual(true);
  });

  it('proof fails: invalid number', async () => {
    updateNestedField(inputMap, ['return', 'number'], incHexStr);
    const witnessMapInvalidNumber = abiEncode(abi, inputMap, inputMap['return']);
    expect(await proofVerifier.verify(proof, witnessMapInvalidNumber)).toEqual(false);
  });

  it('proof fails: invalid state_root', async () => {
    updateNestedField(inputMap, ['return', 'state_root', '0'], incHexStr);
    const witnessMapInvalidStateRoot = abiEncode(abi, inputMap, inputMap['return']);
    expect(await proofVerifier.verify(proof, witnessMapInvalidStateRoot)).toEqual(false);
  });
});
