import { promises as fs } from 'fs';

import toml from 'toml';

import { encodeHexString } from 'noir-ethereum-api-oracles';
import { abiEncode, type InputMap, type WitnessMap, type Abi } from '@noir-lang/noirc_abi';

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
