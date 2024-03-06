import { PublicClient } from 'viem';
import { Call, isEthereumApiMethod } from './recordingClient.js';
import { assert } from '../util/assert.js';
import { readObject } from '../util/file.js';
import { mock } from '../util/mock.js';
import isEqual from 'lodash.isequal';
import { identity } from '../util/function.js';
import { stringify } from '../util/json-bigint.js';

async function readCallsFromFile(filePath: string): Promise<Call[]> {
  if (filePath.includes('new_fixtures')) {
    return [await readObject<Call>(filePath)];
  } else {
    return await readObject<Call[]>(filePath);
  }
}

export async function createMockClient(
  filePaths: string[],
  resultModifier: (call: Call) => Call = identity
): Promise<PublicClient> {
  const savedCalls = (await Promise.all(filePaths.map(readCallsFromFile))).flat();

  return mock<PublicClient>(isEthereumApiMethod, (method: string, args: unknown): unknown => {
    const call: Call | undefined = savedCalls.find((it) => it.method === method && isEqual(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${stringify(args)})`);
    return resultModifier(call).result;
  });
}
