import { PublicClient } from 'viem';

export interface Call {
  method: string;
  arguments: unknown[];
  result: unknown;
}

export type RecordingClientMixin = { getCalls: () => Call[]; getLastCall: () => Call };
export type RecordingClient = PublicClient & RecordingClientMixin;

export const isEthereumApiMethod = (methodName: string) => methodName.startsWith('get');

export const createRecordingClient = (client: PublicClient): RecordingClient => createLoggingProxy(client);

function createLoggingProxy<Target extends Record<string, unknown>>(target: Target): RecordingClient {
  const calls: Call[] = [];

  const handler: ProxyHandler<Target> = {
    get(target: Target, method: string, receiver) {
      if (method === 'getCalls') {
        return () => calls;
      }

      if (method === 'getLastCall') {
        return () => calls[calls.length - 1];
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
