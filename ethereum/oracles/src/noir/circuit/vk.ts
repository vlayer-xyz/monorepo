import { readObject, withTempFile } from '../../util/file.js';
import { writeFile } from 'fs/promises';
import { Barretenberg } from './barretenberg.js';

export async function generateVk(bytecode: string, vkPath: string, vkAsFieldsPath: string): Promise<void> {
  return await withTempFile(async (acirPath) => {
    await writeFile(acirPath, Buffer.from(bytecode, 'base64'));

    const barretenberg = await Barretenberg.create();
    await barretenberg.writeVK(acirPath, vkPath);
    await barretenberg.vkAsFields(vkPath, vkAsFieldsPath);
  });
}

export class VerificationKey {
  public static async create(path: string): Promise<VerificationKey> {
    const [hash, ...asFields] = await readObject<string[]>(path);
    return new VerificationKey(hash, asFields);
  }

  private constructor(
    public hash: string,
    public asFields: string[]
  ) {}
}
