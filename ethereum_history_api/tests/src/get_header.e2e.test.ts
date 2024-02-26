import { describe, expect, it } from 'vitest';
import { copy, updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { abiEncode } from '@noir-lang/noirc_abi';
import getHeaderVerifier from '../../contracts/out/GetHeaderUltraPLONKVerifier.sol/UltraVerifier.json';

import { get_header_circuit, readInputMap, readProof } from './main.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

const PROOF_PATH = '../../proofs/get_header.proof';
const INPUT_MAP_PATH = '../circuits/get_header/Verifier.toml';

describe('get_header', async () => {
  const proofVerifier = await deploySolidityProofVerifier(getHeaderVerifier as FoundryArtefact);

  const proof = await readProof(PROOF_PATH);
  const inputMap = await readInputMap(INPUT_MAP_PATH);

  it('proof verification successes', async () => {
    const witnessMap = abiEncode(get_header_circuit.abi, inputMap, inputMap['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMap);

    expect(isCorrect).toEqual(true);
  });

  it('proof fails: invalid number', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['return', 'number'], incHexStr);
    const witnessMapInvalidNumber = abiEncode(get_header_circuit.abi, inputMapCopy, inputMapCopy['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMapInvalidNumber);

    expect(isCorrect).toEqual(false);
  });

  it('proof fails: invalid state_root', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['return', 'state_root', '0'], incHexStr);
    const witnessMapInvalidStateRoot = abiEncode(get_header_circuit.abi, inputMapCopy, inputMapCopy['return']);

    const isCorrect = await proofVerifier.verify(proof, witnessMapInvalidStateRoot);

    expect(isCorrect).toEqual(false);
  });
});
