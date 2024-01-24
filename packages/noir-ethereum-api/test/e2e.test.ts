import { describe, expect, it } from 'vitest';
import { incHexStr } from '../src/util/string.js';
import { verifyStorageProof, readProof, readWitnessMap, readInputMap, circuit } from '../src/main.js';
import { updateNestedField } from '../src/util/object.js';
import { abiEncode } from '@noir-lang/noirc_abi';

describe(
  'e2e',
  () => {
    it('proof verification successes', async () => {
      const proof = await readProof('test/fixtures/proof/noir_ethereum_history_api.proof');
      const witnessMap = await readWitnessMap('test/fixtures/proof/Verifier.toml');
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(true);
    });

    it('proof fails: invalid proof', async () => {
      const proof = await readProof('test/fixtures/proof/noir_ethereum_history_api.proof');
      const inputMap = await readInputMap('test/fixtures/proof/Verifier.toml');
      updateNestedField(inputMap, ['return', 'proof', '0'], incHexStr);
      const witnessMap = abiEncode(circuit.abi, inputMap, inputMap['return']);
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(false);
    });

    it('proof fails: invalid state root', async () => {
      const proof = await readProof('test/fixtures/proof/noir_ethereum_history_api.proof');
      const inputMap = await readInputMap('test/fixtures/proof/Verifier.toml');
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
    timeout: 20000
  }
);
