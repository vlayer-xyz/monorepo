import {
  BarretenbergBackend,
  type CompiledCircuit
} from '@noir-lang/backend_barretenberg';
import { type InputMap, Noir } from '@noir-lang/noir_js';
// @ts-expect-error The circuit is not yet compiled during the typecheck phase
import noir_ethereum_history_api from '../../../circuit/target/noir_ethereum_history_api.json';
import { type Oracles, defaultOracles } from './noir/oracles/oracles.js';

export interface MainInputs extends InputMap {
  block_no: number
  address: string[]
  state_root: string[]
}

export async function generateAndVerifyStorageProof(
  input: MainInputs,
  oracles: Oracles = defaultOracles
): Promise<boolean> {
  const circuit = noir_ethereum_history_api as unknown as CompiledCircuit;
  const backend = new BarretenbergBackend(circuit);
  const noir = new Noir(circuit, backend);
  const proof = await noir.generateFinalProof(input, oracles);
  return await noir.verifyFinalProof(proof);
}
