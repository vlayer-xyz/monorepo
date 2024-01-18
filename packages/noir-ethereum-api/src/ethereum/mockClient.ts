import { PublicClient } from 'viem';
import { Call, isEthereumApiMethod } from './recordingClient.js';
import { assert } from '../assert.js';
import { readObject } from '../utils/file.js';
import { mock } from '../utils/mock.js';
import isEqual from 'lodash.isequal';

export async function createMockClient(filePath: string): Promise<PublicClient> {
  const savedCalls = await readObject<Call[]>(filePath);

  return mock<PublicClient>(isEthereumApiMethod, (method: string, args: object): object => {
    const call: Call | undefined = savedCalls.find((it) => it.method === method && isEqual(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${args})`);
    return call.result;
  });
}
