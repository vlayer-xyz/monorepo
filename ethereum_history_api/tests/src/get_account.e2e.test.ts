import { describe, expect, it } from 'vitest';
import { copy, updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { abiEncode } from '@noir-lang/noirc_abi';
import { CompiledCircuit } from '@noir-lang/backend_barretenberg';

import getAccountVerifier from '../../contracts/out/GetAccountUltraPLONKVerifier.sol/UltraVerifier.json';
import get_account from '../../../target/get_account.json';

import { readProofData } from './proofDataReader.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

export const get_account_circuit = get_account as unknown as CompiledCircuit;
const PACKAGE_NAME = 'get_account';

describe(PACKAGE_NAME, async () => {
  const { proof, inputMap } = await readProofData(PACKAGE_NAME);
  const proofVerifier = await deploySolidityProofVerifier(getAccountVerifier as FoundryArtefact);

  it('proof verification successes', async () => {
    const witnessMap = abiEncode(get_account_circuit.abi, inputMap, inputMap['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMap);

    expect(isCorrect).toEqual(true);
  });

  it('proof fails: invalid nonce', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['return', 'nonce'], incHexStr);
    const witnessMapInvalidNonce = abiEncode(get_account_circuit.abi, inputMapCopy, inputMapCopy['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMapInvalidNonce);

    expect(isCorrect).toEqual(false);
  });

  it('proof fails: invalid state root', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['state_root', '0'], incHexStr);
    const witnessMapInvalidStateRoot = abiEncode(get_account_circuit.abi, inputMapCopy, inputMapCopy['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMapInvalidStateRoot);

    expect(isCorrect).toEqual(false);
  });
});
