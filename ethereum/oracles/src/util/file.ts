import { parse, stringify } from './json-bigint.js';
import fs, { writeFile } from 'fs/promises';
import os from 'os';
import prettier from 'prettier';
import { randomUUID } from 'crypto';
import path from 'path';
import toml from '@iarna/toml';
import { BaseFixture } from '../fixtures/types.js';
import { TransactionReceipt } from '../types.js';

async function prettierFormatJSON(data: string): Promise<string> {
  const options = await prettier.resolveConfig('./');
  return prettier.format(data, { parser: 'json', ...options });
}

export async function writeObject<T>(object: T, filePath: string): Promise<void> {
  return writeFile(filePath, await prettierFormatJSON(stringify(object)));
}

export async function readFixture<TFixture extends BaseFixture<TResult>, TResult = unknown>(
  filePath: string
): Promise<TFixture> {
  const parsed = await readObjectAndParseAllNumericValuesAsBigNum<TFixture>(filePath);
  const fileName = path.parse(filePath).name;
  if (fileName.startsWith('alchemy_getTransactionReceipts_')) {
    restoreNumberFieldsThatWereWrongfullyParsedAsBigNumbersInReceipts(parsed.result as TransactionReceipt[]);
  }
  return parsed;
}

export async function readObjectAndParseAllNumericValuesAsBigNum<T>(filePath: string): Promise<T> {
  return parse(await fs.readFile(filePath, 'utf8')) as T;
}

export async function readObject<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
}

export async function readTomlObject<T>(filePath: string): Promise<T> {
  return toml.parse(await fs.readFile(filePath, 'utf8')) as T;
}

export async function withTempFile<T>(callback: (path: string) => Promise<T>): Promise<T> {
  const pkgName = process.env.npm_package_name ?? randomUUID();
  const testTempDir = await fs.mkdtemp(`${os.tmpdir()}/${pkgName}-temp-dir`);
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
