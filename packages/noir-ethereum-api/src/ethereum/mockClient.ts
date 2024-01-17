import { PublicClient } from 'viem';
import { Call } from './recordingClient.js';
import { assert } from '../assert.js';
import { readObjectSync } from '../utils/file.js';
import { equals } from '../utils/object.js';
import { mock } from '../utils/mock.js';

export function createMockClient(filePath: string): PublicClient {
  const savedCalls = readObjectSync<Call[]>(filePath);

  return mock<PublicClient>((method: string, args: object): object => {
    const call: Call | undefined = savedCalls.find((it) => equals(it.method, method) && equals(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${args})`);
    return call.result;
  });
}
