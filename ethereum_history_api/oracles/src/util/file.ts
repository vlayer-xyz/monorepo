import { parse, stringify } from './json-bigint.js';
import fs, { writeFile } from 'fs/promises';
import os from 'os';
import prettier from 'prettier';
import path from 'path';
import packgeJson from '../../package.json';
import { BaseFixture } from '../fixtures/types.js';
import { TransactionReceipt } from '../types.js';

async function prettierFormatJSON(data: string): Promise<string> {
  const options = await prettier.resolveConfig('./');
  return prettier.format(data, { parser: 'json', ...options });
}

export async function writeObject<T>(object: T, filePath: string): Promise<void> {
  return writeFile(filePath, await prettierFormatJSON(stringify(object)));
}

export async function readObject<TFixture extends BaseFixture<TResult>, TResult = unknown>(
  filePath: string
): Promise<TFixture> {
  const parsed = parse(await fs.readFile(filePath, 'utf8')) as TFixture;
  const fileName = path.parse(filePath).name;
  if (fileName.startsWith('alchemy_getTransactionReceipts_')) {
    restoreNumberFieldsThatWereWrongfullyParsedAsBigNumbersInReceipts(parsed.result as TransactionReceipt[]);
  }
  return parsed;
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

export function restoreNumberFieldsThatWereWrongfullyParsedAsBigNumbersInReceipts(
  receipts: TransactionReceipt[]
): void {
  receipts.forEach((receipt) => {
    receipt.transactionIndex = Number(receipt.transactionIndex);
  });
}
