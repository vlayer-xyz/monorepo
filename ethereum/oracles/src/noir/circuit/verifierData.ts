import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';
import { readTomlObject } from '../../util/file.js';
import { Hex } from 'viem';
import { publicInputs, returnValues } from './abi.js';

export class VerifierData {
  public static async create(verifierTomlPath: string, abi: Abi) {
    const verifierData = await readTomlObject<InputMap>(verifierTomlPath);
    return new VerifierData(abi, verifierData);
  }

  public publicInputs(): Hex[] {
    return this.encodeSubset(publicInputs(this.abi));
  }

  public returnValues(): Hex[] {
    return this.encodeSubset(returnValues(this.abi));
  }

  public encodeSubset(subset: Abi): Hex[] {
    const subsetEncodedMap = abiEncode(subset, this.verifierData, this.verifierData.return);
    return Array.from(subsetEncodedMap.values()) as Hex[];
  }

  private constructor(
    private abi: Abi,
    private verifierData: InputMap
  ) {}
}
