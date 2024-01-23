import { PublicClient } from 'viem';
import { Call, isEthereumApiMethod } from './recordingClient.js';
import { assert } from '../util/assert.js';
import { readObject } from '../util/file.js';
import { mock } from '../util/mock.js';
import isEqual from 'lodash.isequal';
import { identity } from '../util/function.js';

export async function createMockClient(
  filePath: string,
  resultModifier: (call: Call) => Call = identity
): Promise<PublicClient> {
  const savedCalls = await readObject<Call[]>(filePath);

  return mock<PublicClient>(isEthereumApiMethod, (method: string, args: object): object => {
    const call: Call | undefined = savedCalls.find((it) => it.method === method && isEqual(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${args})`);
    return resultModifier(call).result;
  });
}
