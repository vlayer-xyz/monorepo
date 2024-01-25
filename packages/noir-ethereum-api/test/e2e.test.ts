import { beforeAll, describe, expect, it } from 'vitest';
import { verifyStorageProof, readProof, readWitnessMap } from '../src/main.js';
import { WitnessMap } from '@noir-lang/noirc_abi';

const PROOF_PATH = '../../circuit/proofs/noir_ethereum_history_api.proof';
const INPUT_MAP_PATH = '../../circuit/Verifier.toml';

describe(
  'e2e',
  () => {
    let proof: Uint8Array;
    let witnessMap: WitnessMap;

    beforeAll(async () => {
      proof = await readProof(PROOF_PATH);
      witnessMap = await readWitnessMap(INPUT_MAP_PATH);
    });

    it('proof verification successes', async () => {
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(true);
    });
  },
  {
    timeout: 20000
  }
);
