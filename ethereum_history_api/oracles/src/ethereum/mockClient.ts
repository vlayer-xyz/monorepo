import { Call, isEthereumApiMethod } from './recordingClient.js';
import { assert } from '../util/assert.js';
import { readFixture } from '../util/file.js';
import { mock } from '../util/mock.js';
import isEqual from 'lodash.isequal';
import { identity } from '../util/function.js';
import { stringify } from '../util/json-bigint.js';
import { AlchemyClient, MultiChainClient } from './client.js';
import { mainnet } from 'viem/chains';

export async function createMockMultiChainClient(
  filePaths: string[],
  resultModifier: (call: Call) => Call = identity,
  chain = mainnet
): Promise<MultiChainClient> {
  const mockClient = await createMockClient(filePaths, resultModifier, chain);
  return MultiChainClient.from(mockClient);
}

export async function createMockClient(
  filePaths: string[],
  resultModifier: (call: Call) => Call = identity,
  chain = mainnet
): Promise<AlchemyClient> {
  const savedCalls = (await Promise.all(filePaths.map(readFixture<Call>))).flat();

  const mockMethodHandler = (method: string, args: unknown): unknown => {
    const call: Call | undefined = savedCalls.find((it) => it.method === method && isEqual(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${stringify(args)})`);
    return resultModifier(call).result;
  };
  const mockClient = mock<AlchemyClient>(isEthereumApiMethod, mockMethodHandler);
  mockClient.chain = chain;

  return mockClient;
}
