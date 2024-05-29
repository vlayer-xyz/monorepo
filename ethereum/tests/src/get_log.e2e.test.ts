import { beforeEach, describe, expect, it } from 'vitest';
import { updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';

import getLogVerifier from '../../contracts/out/GetLogUltraPLONKVerifier.sol/UltraVerifier.json';
import getLog from '../../../target/get_log.json';

import { readProofData } from './proofDataReader.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

export const abi = getLog.abi as unknown as Abi;

describe('get_log', async () => {
  let proof: Uint8Array;
  let inputMap: InputMap;
  const proofVerifier = await deploySolidityProofVerifier(getLogVerifier as FoundryArtefact);

  beforeEach(async () => {
    ({ proof, inputMap } = await readProofData('get_log'));
  });

  it('proof verification succeeds', async () => {
    const witnessMap = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMap)).toEqual(true);
  });

  it('proof fails: invalid log value', async () => {
    updateNestedField(inputMap, ['return', 'log', 'address', '0'], incHexStr);
    const witnessMapInvalidReceiptValue = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMapInvalidReceiptValue)).toEqual(false);
  });

  it('proof fails: invalid block hash', async () => {
    updateNestedField(inputMap, ['return', 'block_hash', '0'], incHexStr);
    const witnessMapInvalidBlockHash = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMapInvalidBlockHash)).toEqual(false);
  });
});
