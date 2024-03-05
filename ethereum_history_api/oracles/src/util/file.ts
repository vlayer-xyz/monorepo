import { parse, stringify } from './json-bigint.js';
import fs, { writeFile } from 'fs/promises';
import os from 'os';
import prettier from 'prettier';
import packgeJson from '../../package.json';

async function prettierFormatJSON(data: string): Promise<string> {
  const options = await prettier.resolveConfig('./');
  return prettier.format(data, { parser: 'json', ...options });
}

export async function writeObject<T>(object: T, filePath: string): Promise<void> {
  return writeFile(filePath, await prettierFormatJSON(stringify(object)));
}

export async function readObject<T>(filePath: string): Promise<T> {
  return parse(await fs.readFile(filePath, 'utf8')) as T;
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
