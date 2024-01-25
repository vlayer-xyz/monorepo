import { BarretenbergBackend, ProofData, type CompiledCircuit } from '@noir-lang/backend_barretenberg';
import { Noir, WitnessMap } from '@noir-lang/noir_js';
import { promises as fs } from 'fs';
import toml from 'toml';
import noir_ethereum_history_api from '../../../circuit/target/noir_ethereum_history_api.json';
import { abiEncode, type InputMap } from '@noir-lang/noirc_abi';
import { isHex } from 'viem';

export const circuit = noir_ethereum_history_api as unknown as CompiledCircuit;

export async function verifyStorageProof(proof: ProofData): Promise<boolean> {
  const backend = new BarretenbergBackend(circuit);
  const noir = new Noir(circuit, backend);
  return await noir.verifyFinalProof(proof);
}

export async function readProof(path: string): Promise<Uint8Array> {
  const proofHex = await fs.readFile(path, 'utf-8');
  return encodeHexString('0x' + proofHex);
}

export async function readWitnessMap(path: string): Promise<WitnessMap> {
  const inputMap = await readInputMap(path);
  const witnessMap = abiEncode(circuit.abi, inputMap, inputMap['return']);
  return witnessMap;
}

export async function readInputMap(path: string): Promise<InputMap> {
  const verifierData = await fs.readFile(path, 'utf-8');
  const inputMap = toml.parse(verifierData);
  return inputMap;
}

export function encodeHexString(value: string): Uint8Array {
  if (!isHex(value)) {
    throw new Error(`Invalid hexstring: ${value}`);
  }
  const arr = [];
  for (let i = 2; i < value.length; i += 2) {
    arr.push(parseInt(value.substr(i, 2), 16));
  }
  return new Uint8Array(arr);
}
