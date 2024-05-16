import { beforeEach, describe, expect, it } from 'vitest';
import { updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';

import getTransactionVerifier from '../../contracts/out/GetTransactionUltraPLONKVerifier.sol/UltraVerifier.json';
import getTransaction from '../../../target/get_transaction.json';

import { readProofData } from './proofDataReader.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

export const abi = getTransaction.abi as unknown as Abi;

describe('get_transaction', async () => {
  let proof: Uint8Array;
  let inputMap: InputMap;
  const proofVerifier = await deploySolidityProofVerifier(getTransactionVerifier as FoundryArtefact);

  beforeEach(async () => {
    ({ proof, inputMap } = await readProofData('get_transaction'));
  });

  it('proof verification successes', async () => {
    const witnessMap = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMap)).toEqual(true);
  });

  it('proof fails: invalid transaction value', async () => {
    updateNestedField(inputMap, ['return', 'transaction', 'nonce'], incHexStr);
    const witnessMapInvalidReceiptValue = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMapInvalidReceiptValue)).toEqual(false);
  });

  it('proof fails: invalid block hash', async () => {
    updateNestedField(inputMap, ['return', 'block_hash', '0'], incHexStr);
    const witnessMapInvalidBlockHash = abiEncode(abi, inputMap, inputMap.return);
    expect(await proofVerifier.verify(proof, witnessMapInvalidBlockHash)).toEqual(false);
  });
});
