import { promises as fs } from 'fs';
import toml from 'toml';
import noir_ethereum_history_api from '../../../target/main.json';
import { encodeHexString } from 'noir-ethereum-api-oracles';
import { abiEncode } from '@noir-lang/noirc_abi';
export const circuit = noir_ethereum_history_api;
export async function readProof(path) {
    const proofHex = await fs.readFile(path, 'utf-8');
    return encodeHexString('0x' + proofHex);
}
export async function readWitnessMap(path) {
    const inputMap = await readInputMap(path);
    const witnessMap = abiEncode(circuit.abi, inputMap, inputMap['return']);
    return witnessMap;
}
export async function readInputMap(path) {
    const verifierData = await fs.readFile(path, 'utf-8');
    const inputMap = toml.parse(verifierData);
    return inputMap;
}
