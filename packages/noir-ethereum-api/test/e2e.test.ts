import { beforeAll, describe, expect, it } from 'vitest';
import { incHexStr } from '../src/util/string.js';
import { verifyStorageProof, readProof, readWitnessMap, readInputMap, circuit } from '../src/main.js';
import { updateNestedField } from '../src/util/object.js';
import { InputMap, WitnessMap, abiEncode } from '@noir-lang/noirc_abi';

const PROOF_PATH = '../../proofs/main.proof';
const INPUT_MAP_PATH = '../../circuits/main/Verifier.toml';

describe.concurrent(
  'e2e',
  () => {
    let proof: Uint8Array;
    let inputMap: InputMap;
    let witnessMap: WitnessMap;

    beforeAll(async () => {
      proof = await readProof(PROOF_PATH);
      inputMap = await readInputMap(INPUT_MAP_PATH);
      witnessMap = await readWitnessMap(INPUT_MAP_PATH);
    });

    it('proof verification successes', async () => {
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(true);
    });

    it('proof fails: invalid proof', async () => {
      updateNestedField(inputMap, ['return', 'proof', '0'], incHexStr);
      const witnessMap = abiEncode(circuit.abi, inputMap, inputMap['return']);
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(false);
    });

    it('proof fails: invalid state root', async () => {
      updateNestedField(inputMap, ['state_root', '0'], incHexStr);
      const witnessMap = abiEncode(circuit.abi, inputMap, inputMap['return']);
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(false);
    });
  },
  {
    timeout: 2 * 60 * 1000
  }
);
