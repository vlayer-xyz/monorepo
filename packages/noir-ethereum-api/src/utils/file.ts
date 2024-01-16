import { stringify } from './json-bigint.js';
import { writeFile } from 'fs/promises';

export function writeObject(object: object, filePath: string): Promise<void> {
  return writeFile(filePath, stringify(object));
}
