import { AlchemyClient } from './client.js';

export interface Call {
  method: string;
  arguments: unknown[];
  result: unknown;
}

export interface RecordingClientMixin {
  getCalls: () => Call[];
}
export type RecordingClient = AlchemyClient & RecordingClientMixin;

export const isEthereumApiMethod = (methodName: string) => methodName.startsWith('get');

export const createRecordingClient = (client: AlchemyClient): RecordingClient => createLoggingProxy(client);

function createLoggingProxy<Target extends Record<string, unknown>>(target: Target): RecordingClient {
  const calls: Call[] = [];

  const handler: ProxyHandler<Target> = {
    get(target: Target, method: string, receiver) {
      if (method === 'getCalls') {
        return () => calls;
      }

      const originalMethod = target[method];
      if (typeof originalMethod === 'function' && isEthereumApiMethod(method)) {
        return async (...args: unknown[]): Promise<unknown> => {
          const result = (await originalMethod.apply(target, args)) as unknown;
          calls.push({
            method,
            arguments: args,
            result
          });
          return result;
        };
      }
      return Reflect.get(target, method, receiver);
    }
  };

  return new Proxy(target, handler) as unknown as RecordingClient;
}
