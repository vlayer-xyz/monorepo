import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';
import { readTomlObject } from '../../util/file.js';
import { Hex } from 'viem';
import { filterPublic } from '../../util/abi.js';

export class VerifierData {
  private verifierData: InputMap;
  private abi: Abi;

  public static async create(verifierTomlPath: string, abi: Abi) {
    const verifierData = await readTomlObject<InputMap>(verifierTomlPath);
    return new VerifierData(abi, verifierData);
  }

  public publicInputs(): Hex[] {
    const publicInputsAbi = filterPublic(this.abi);
    const publicInputsEncodedMap = abiEncode(publicInputsAbi, this.verifierData, this.verifierData.return);
    return Array.from(publicInputsEncodedMap.values()) as Hex[];
  }

  public returnValues(): Hex[] {
    const returnAbi = {
      parameters: [],
      param_witnesses: {},
      return_type: this.abi.return_type,
      return_witnesses: this.abi.return_witnesses,
      error_types: this.abi.error_types
    } as Abi;
    const publicInputsEncodedMap = abiEncode(returnAbi, {}, this.verifierData.return);
    return Array.from(publicInputsEncodedMap.values()) as Hex[];
  }

  private constructor(abi: Abi, verifierData: InputMap) {
    this.abi = abi;
    this.verifierData = verifierData;
  }
}
