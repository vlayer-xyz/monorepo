import { PublicClient } from 'viem';
import { Call } from './recordingClient.js';
import { assert } from '../assert.js';
import { readObjectSync } from '../utils/file.js';
import { equals } from '../utils/object.js';

export function createMockingClient(filePath: string): PublicClient {
  const savedCalls = readObjectSync<Call[]>(filePath);

  return createMock<PublicClient>((method: string, args: object): object => {
    const call: Call | undefined = savedCalls.find((it) => equals(it.method, method) && equals(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${args})`);
    return call.result;
  });
}

export function createMock<T extends object>(methodHandler: (method: string, args: object) => object): T {
  const handler: ProxyHandler<T> = {
    get(_target: T, prop: string) {
      return (...args: object[]) => methodHandler(prop, args);
    }
  };

  return new Proxy({}, handler) as T;
}
