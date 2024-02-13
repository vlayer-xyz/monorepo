import { parse, stringify } from './json-bigint.js';
import fs, { writeFile } from 'fs/promises';
import os from 'os';
import packgeJson from '../../package.json';
export function writeObject(object, filePath) {
    return writeFile(filePath, stringify(object));
}
export async function readObject(filePath) {
    return parse(await fs.readFile(filePath, 'utf8'));
}
export async function withTempFile(callback) {
    const testTempDir = await fs.mkdtemp(`${os.tmpdir()}/${packgeJson.name}-temp-dir-`);
    const tempFilePath = `${testTempDir}/temp-${Date.now()}.json`;
    try {
        return await callback(tempFilePath);
    }
    finally {
        await fs.unlink(tempFilePath);
        await fs.rmdir(testTempDir);
    }
}
