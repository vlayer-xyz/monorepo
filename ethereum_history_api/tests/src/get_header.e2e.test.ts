import { describe, expect, it } from 'vitest';
import { copy, updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { Abi, abiEncode } from '@noir-lang/noirc_abi';

import getHeaderVerifier from '../../contracts/out/GetHeaderUltraPLONKVerifier.sol/UltraVerifier.json';
import getHeader from '../../../target/get_header.json';

import { readProofData } from './proofDataReader.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

export const abi = getHeader.abi as unknown as Abi;
const PACKAGE_NAME = 'get_header';

describe(PACKAGE_NAME, async () => {
  const { proof, inputMap } = await readProofData(PACKAGE_NAME);
  const proofVerifier = await deploySolidityProofVerifier(getHeaderVerifier as FoundryArtefact);

  it('proof verification successes', async () => {
    const witnessMap = abiEncode(abi, inputMap, inputMap['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMap);

    expect(isCorrect).toEqual(true);
  });

  it('proof fails: invalid number', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['return', 'number'], incHexStr);
    const witnessMapInvalidNumber = abiEncode(abi, inputMapCopy, inputMapCopy['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMapInvalidNumber);

    expect(isCorrect).toEqual(false);
  });

  it('proof fails: invalid state_root', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['return', 'state_root', '0'], incHexStr);
    const witnessMapInvalidStateRoot = abiEncode(abi, inputMapCopy, inputMapCopy['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMapInvalidStateRoot);

    expect(isCorrect).toEqual(false);
  });
});
