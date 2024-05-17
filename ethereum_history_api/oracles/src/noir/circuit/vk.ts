import { readObject, withTempFile } from '../../util/file.js';
import { writeFile } from 'fs/promises';
import { MonorepoCircuit } from './circuit.js';
import { Barretenberg } from './barretenberg.js';

export async function generateVk(circuit: MonorepoCircuit): Promise<void> {
  return await withTempFile(async (acirPath) => {
    await writeFile(acirPath, Buffer.from(circuit.bytecode(), 'base64'));

    const barretenberg = await Barretenberg.create();
    await barretenberg.writeVK(acirPath, circuit.vkPath());
    await barretenberg.vkAsFields(circuit.vkPath(), circuit.vkAsFieldsPath());
  });
}

export class VerificationKey {
  public static async create(circuit: MonorepoCircuit): Promise<VerificationKey> {
    const [hash, ...asFields] = await readObject<string[]>(circuit.vkAsFieldsPath());
    return new VerificationKey(hash, asFields);
  }

  private constructor(
    public hash: string,
    public asFields: string[]
  ) {}
}
