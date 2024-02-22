import { promises as fs } from 'fs';
import { type CompiledCircuit } from '@noir-lang/backend_barretenberg';
import get_header from '../../../target/get_header.json';
import get_account from '../../../target/get_account.json';
import toml from 'toml';

import { encodeHexString } from 'noir-ethereum-api-oracles';
import { abiEncode, type InputMap, type WitnessMap, type Abi } from '@noir-lang/noirc_abi';

export const get_header_circuit = get_header as unknown as CompiledCircuit;
export const get_account_circuit = get_account as unknown as CompiledCircuit;

export const ANVIL_TEST_ACCOUNT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
export const VERIFICATION_GAS_LIMIT = 500_000n;

export async function readProof(path: string): Promise<Uint8Array> {
  const proofHex = await fs.readFile(path, 'utf-8');
  return encodeHexString('0x' + proofHex);
}

export async function readWitnessMap(path: string, abi: Abi): Promise<WitnessMap> {
  const inputMap = await readInputMap(path);
  const witnessMap = abiEncode(abi, inputMap, inputMap['return']);
  return witnessMap;
}

export async function readInputMap(path: string): Promise<InputMap> {
  const verifierData = await fs.readFile(path, 'utf-8');
  const inputMap = toml.parse(verifierData);
  return inputMap;
}
