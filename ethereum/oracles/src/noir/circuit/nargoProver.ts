import path from 'path';
import { MonorepoCircuit } from './circuit.js';
import { $ } from 'execa';
import toml from '@iarna/toml';
import { InputMap } from '@noir-lang/noirc_abi';
import { readFile, unlink, writeFile } from 'fs/promises';
import { readTomlObject } from '../../util/file.js';
import { addHexPrefix } from '../../util/hex.js';
import { type Hex } from 'viem';

export interface NargoProve {
  proof: Hex;
  verifierData: InputMap;
}

// IMPORTANT: The proof paths used here are not unique to the `proofId` - therefore they can be overridden in parallel proof generation.
// https://github.com/noir-lang/noir/issues/5037
export class NargoProver {
  private proverName = `Prover_${this.proofId}`;
  private proverTomlPath = path.join(this.circuit.packagePath(), `${this.proverName}.toml`);
  private verifierName = `Verifier_${this.proofId}`;
  private verifierTomlPath = path.join(this.circuit.packagePath(), `${this.verifierName}.toml`);
  private proofPath = path.join(this.circuit.root, 'proofs', `${this.circuit.name}.proof`);

  constructor(
    public circuit: MonorepoCircuit,
    public proofId: string
  ) {}

  public async executeProveCommand(): Promise<void> {
    await $`nargo prove --package ${this.circuit.name} --oracle-resolver http://localhost:5555 -p ${this.proverName} -v ${this.verifierName}`;
  }

  public async prove(inputs: InputMap): Promise<NargoProve> {
    await writeFile(this.proverTomlPath, toml.stringify(inputs as toml.JsonMap));
    await this.executeProveCommand();
    const verifierData = await readTomlObject<InputMap>(this.verifierTomlPath);
    await unlink(this.proverTomlPath);
    await unlink(this.verifierTomlPath);

    const proof = addHexPrefix(await readFile(this.proofPath, 'utf-8'));
    return {
      proof,
      verifierData
    };
  }
}
