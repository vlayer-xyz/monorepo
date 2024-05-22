import { $ } from 'execa';
import path from 'path';
import os from 'os';

export class Barretenberg {
  public static async create(): Promise<Barretenberg> {
    const { stdout: currentBackend } = await $`nargo backend current`;
    const binaryPath = path.join(os.homedir(), '.nargo/backends', currentBackend, 'backend_binary');
    return new Barretenberg(binaryPath);
  }
  public async writeVK(acirPath: string, vkPath: string) {
    await $`${this.binaryPath} write_vk -b ${acirPath} -o ${vkPath}`;
  }
  public async vkAsFields(vkPath: string, vkAsFieldsPath: string) {
    await $`${this.binaryPath} vk_as_fields -k ${vkPath} -o ${vkAsFieldsPath}`;
  }
  public async proofAsFields(vkPath: string, proofWithInputsPath: string, proofAsFieldsPath: string) {
    await $`${this.binaryPath} proof_as_fields -k ${vkPath} -p ${proofWithInputsPath} -o ${proofAsFieldsPath}`;
  }

  private constructor(private binaryPath: string) {}
}
