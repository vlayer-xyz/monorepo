import { Call, isEthereumApiMethod } from './recordingClient.js';
import { assert } from '../util/assert.js';
import { readObject } from '../util/file.js';
import { mock } from '../util/mock.js';
import isEqual from 'lodash.isequal';
import { identity } from '../util/function.js';
import { stringify } from '../util/json-bigint.js';
import { AlchemyClient } from './client.js';

export async function createMockClient(
  filePaths: string[],
  resultModifier: (call: Call) => Call = identity
): Promise<AlchemyClient> {
  const savedCalls = (await Promise.all(filePaths.map(readObject<Call>))).flat();

  return mock<AlchemyClient>(isEthereumApiMethod, (method: string, args: unknown): unknown => {
    const call: Call | undefined = savedCalls.find((it) => it.method === method && isEqual(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${stringify(args)})`);
    return resultModifier(call).result;
  });
}
