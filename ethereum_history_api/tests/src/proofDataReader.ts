import { promises as fs } from 'fs';

import toml from 'toml';

import { encodeHexStringToArray } from 'noir-ethereum-api-oracles';
import { type InputMap } from '@noir-lang/noirc_abi';

interface ProofData {
  proof: Uint8Array;
  inputMap: InputMap;
}

async function readProof(path: string): Promise<Uint8Array> {
  const proofHex = await fs.readFile(path, 'utf-8');
  return encodeHexStringToArray('0x' + proofHex);
}

async function readInputMap(path: string): Promise<InputMap> {
  const verifierData = await fs.readFile(path, 'utf-8');
  const inputMap = toml.parse(verifierData) as InputMap;
  return inputMap;
}

export async function readProofData(packageName: string): Promise<ProofData> {
  const proofPath = `../../proofs/${packageName}.proof`;
  const inputMapPath = `../circuits/${packageName}/Verifier.toml`;

  return {
    proof: await readProof(proofPath),
    inputMap: await readInputMap(inputMapPath)
  };
}
