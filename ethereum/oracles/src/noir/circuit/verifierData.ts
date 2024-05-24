import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';
import { readTomlObject } from '../../util/file.js';
import { Hex } from 'viem';
import { CircuitAbi } from './abi.js';

export class VerifierData {
  public static async create(verifierTomlPath: string, abi: Abi) {
    const verifierData = await readTomlObject<InputMap>(verifierTomlPath);
    return new VerifierData(new CircuitAbi(abi), verifierData);
  }

  public publicInputs(): Hex[] {
    return this.encodeSubset(this.abi.public());
  }

  public returnValues(): Hex[] {
    return this.encodeSubset(this.abi.return());
  }

  public encodeSubset(subset: Abi): Hex[] {
    const subsetEncodedMap = abiEncode(subset, this.verifierData, this.verifierData.return);
    return Array.from(subsetEncodedMap.values()) as Hex[];
  }

  private constructor(
    private abi: CircuitAbi,
    private verifierData: InputMap
  ) {}
}
