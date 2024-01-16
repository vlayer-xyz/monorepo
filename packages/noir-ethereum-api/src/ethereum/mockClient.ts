import { PublicClient } from 'viem';
import { Call } from './recordingClient.js';
import { assert } from '../assert.js';
import { equals } from '../utils/object.js';
import { readObjectSync } from '../utils/file.js';

export function createMockingClient(filePath: string): PublicClient {
  const savedCalls = readObjectSync<Call[]>(filePath);

  return createMock<PublicClient>((method: string, args) => {
    const call = savedCalls.find((it) => equals(it.method, method) && equals(it.arguments, args));
    assert(!!call, `call not found for: ${method}(${args})`);
    return call.result;
  });
}

export function createMock<T>(methodHandler: (method: string, args: object) => object): T {
  const handler: ProxyHandler<any> = {
    get(target, prop: string, receiver) {
      if (!(prop in target)) {
        target[prop] = (...args: any[]) => {
          return methodHandler(prop, args);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  };

  return new Proxy({}, handler) as T;
}
