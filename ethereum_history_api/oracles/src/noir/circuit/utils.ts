import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';
import { filterPublic } from '../../util/abi.js';
import { writeFile } from 'fs/promises';
import { Hex, concatHex } from 'viem';
import { removeHexPrefix } from '../../util/hex.js';
import { Barretenberg } from './barretenberg.js';
import { readObject, withTempFile } from '../../util/file.js';

export async function encodeProofAsFields(
  proof: Hex,
  publicInputs: Hex[],
  vkPath: string,
  proofAsFieldsPath: string
): Promise<Hex[]> {
  const barretenberg = await Barretenberg.create();

  const proofWithInputsHex = concatHex([concatHex(publicInputs), proof]);

  await withTempFile(async (proofWithInputsPath) => {
    await writeFile(proofWithInputsPath, removeHexPrefix(proofWithInputsHex), 'hex');
    await barretenberg.proofAsFields(vkPath, proofWithInputsPath, proofAsFieldsPath);
  });

  const proofAsFieldsWithInputs = await readObject<Hex[]>(proofAsFieldsPath);
  const proofAsFields = proofAsFieldsWithInputs.slice(publicInputs.length);
  return proofAsFields;
}

export function encodePublicInputs(abi: Abi, verifierData: InputMap): Hex[] {
  const publicInputsAbi = filterPublic(abi);
  const publicInputsEncodedMap = abiEncode(publicInputsAbi, verifierData, verifierData.return);
  return Array.from(publicInputsEncodedMap.values()) as Hex[];
}
