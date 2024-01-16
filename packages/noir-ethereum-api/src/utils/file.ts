import { stringify } from './json-bigint.js';
import { writeFile } from 'fs/promises';
import fs from 'fs/promises';
import os from 'os';
import packgeJson from '../../package.json';

export function writeObject(object: object, filePath: string): Promise<void> {
  return writeFile(filePath, stringify(object));
}

export async function withTempFile<T>(callback: (path: string) => Promise<T>): Promise<T> {
  const testTempDir = await fs.mkdtemp(`${os.tmpdir()}/${packgeJson.name}-temp-dir-`);
  const tempFilePath = `${testTempDir}/temp-${Date.now()}.json`;
  try {
    return await callback(tempFilePath);
  } finally {
    await fs.unlink(tempFilePath);
    await fs.rmdir(testTempDir);
  }
}
