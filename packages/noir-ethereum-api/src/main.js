import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import noir_ethereum_history_api from './circuit/target/noir_ethereum_history_api.json';
import { oracles } from './oracles';

export async function generate_and_verify_simple_proof(input) {
  const backend = new BarretenbergBackend(noir_ethereum_history_api);
  const noir = new Noir(noir_ethereum_history_api, backend);
  const proof = await noir.generateFinalProof(input, oracles);
  return await noir.verifyFinalProof(proof);
};
