import { BarretenbergBackend, ProofData, type CompiledCircuit } from '@noir-lang/backend_barretenberg';
import { type InputMap, Noir } from '@noir-lang/noir_js';
import { promises as fs } from 'fs';
import toml from 'toml';
import noir_ethereum_history_api from '../../../circuit/target/noir_ethereum_history_api.json';
import { type Oracles, defaultOracles } from './noir/oracles/oracles.js';
import { decodeHexString, encodeHexString } from './noir/encode.js';

export interface MainInputs extends InputMap {
  block_no: number;
  address: string[];
  state_root: string[];
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

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export async function recordStorageProof(
  input: MainInputs,
  oracles: Oracles = defaultOracles,
  name: string
): Promise<boolean> {
  const circuit = noir_ethereum_history_api as unknown as CompiledCircuit;
  const backend = new BarretenbergBackend(circuit);
  const noir = new Noir(circuit, backend);
  const proof = await noir.generateFinalProof(input, oracles);

  const proofHex = decodeHexString(proof.proof);
  await fs.writeFile(`${name}.proof`, proofHex);

  const publicInputsData = Array.from(proof.publicInputs.values()).join('\n');
  await fs.writeFile(`${name}.publicInputs`, publicInputsData);

  const isCorrect = await noir.verifyFinalProof(proof);
  return isCorrect;
}

export async function verifyStorageProof(proof: ProofData): Promise<boolean> {
  const circuit = noir_ethereum_history_api as unknown as CompiledCircuit;
  const backend = new BarretenbergBackend(circuit);
  const noir = new Noir(circuit, backend);
  return await noir.verifyFinalProof(proof);
}

export async function readProof(path: string): Promise<Uint8Array> {
  const proofHex = await fs.readFile(path, 'utf-8');
  return encodeHexString(proofHex);
}

export async function readPublicInputs(path: string): Promise<string[]> {
  const verifierData = await fs.readFile(path, 'utf-8');
  const publicInputs = toml.parse(verifierData);
  const { block_no, address, state_root } = publicInputs;
  const { balance, codeHash, nonce, key, value, proof, depth } = publicInputs.return;
  const flatPublicInputs = [
    block_no,
    ...address,
    ...state_root,
    balance,
    ...codeHash,
    nonce,
    ...key,
    ...value,
    ...proof,
    depth
  ];

  return flatPublicInputs;
}
