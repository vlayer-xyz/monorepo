import { describe, expect, it } from 'vitest';
import { copy, updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { abiEncode } from '@noir-lang/noirc_abi';

import getAccountVerifier from '../../contracts/out/GetAccountUltraPLONKVerifier.sol/UltraVerifier.json';
import { get_account_circuit, readInputMap, readProof } from './main.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

const PROOF_PATH = '../../proofs/get_account.proof';
const INPUT_MAP_PATH = '../circuits/get_account/Verifier.toml';

describe('get_account', async () => {
  const proofVerifier = await deploySolidityProofVerifier(getAccountVerifier as FoundryArtefact);

  const proof = await readProof(PROOF_PATH);
  const inputMap = await readInputMap(INPUT_MAP_PATH);

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
