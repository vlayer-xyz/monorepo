import { beforeEach, describe, expect, it } from 'vitest';
import { updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';

import getReceiptVerifier from '../../contracts/out/GetReceiptUltraPLONKVerifier.sol/UltraVerifier.json';
import getReceipt from '../../../target/get_receipt.json';

import { readProofData } from './proofDataReader.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

export const abi = getReceipt.abi as unknown as Abi;

describe('get_receipt', async () => {
  let proof: Uint8Array;
  let inputMap: InputMap;
  const proofVerifier = await deploySolidityProofVerifier(getReceiptVerifier as FoundryArtefact);

  beforeEach(async () => {
    ({ proof, inputMap } = await readProofData('get_receipt'));
  });

  it('proof verification succeeds', async () => {
    const witnessMap = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMap)).toEqual(true);
  });

  it('proof fails: invalid receipt value', async () => {
    updateNestedField(inputMap, ['return', 'receipt', 'cumulative_gas_used'], incHexStr);
    const witnessMapInvalidReceiptValue = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMapInvalidReceiptValue)).toEqual(false);
  });

  it('proof fails: invalid block hash', async () => {
    updateNestedField(inputMap, ['return', 'block_hash', '0'], incHexStr);
    const witnessMapInvalidBlockHash = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMapInvalidBlockHash)).toEqual(false);
  });
});
