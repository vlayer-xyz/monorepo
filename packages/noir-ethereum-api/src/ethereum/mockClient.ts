import { PublicClient } from 'viem';
import { Call, ethApiMethodCondition } from './recordingClient.js';
import { assert } from '../assert.js';
import { readObject } from '../utils/file.js';
import { equals } from '../utils/object.js';
import { mock } from '../utils/mock.js';

export async function createMockClient(filePath: string): Promise<PublicClient> {
  const savedCalls = await readObject<Call[]>(filePath);

  return mock<PublicClient>(ethApiMethodCondition, (method: string, args: object): object => {
    const call: Call | undefined = savedCalls.find((it) => equals(it.method, method) && equals(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${args})`);
    return call.result;
  });
}
