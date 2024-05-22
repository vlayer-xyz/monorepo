import { CompiledCircuit } from '@noir-lang/noir_js';
import { readObject } from '../../util/file.js';
import path from 'path';

export class MonorepoCircuit {
  public static async create(root: string, name: string): Promise<MonorepoCircuit> {
    const artefactPath = path.join(root, 'target', `${name}.json`);
    const artefact = await readObject<CompiledCircuit>(artefactPath);
    return new MonorepoCircuit(root, name, artefact);
  }

  public bytecode(): string {
    return this.artefact.bytecode;
  }

  public vkPath(): string {
    return path.join(this.root, 'target', `${this.name}.vk.bin`);
  }

  public vkAsFieldsPath(): string {
    return path.join(this.root, 'target', `${this.name}.vk.json`);
  }

  public packagePath(): string {
    return path.join(this.root, 'ethereum', 'circuits', this.name);
  }

  private constructor(
    public root: string,
    public name: string,
    public artefact: CompiledCircuit
  ) {}
}
