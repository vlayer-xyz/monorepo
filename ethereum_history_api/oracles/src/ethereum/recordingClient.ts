import { PublicClient } from 'viem';

export type Call = {
  method: string;
  arguments: unknown[];
  result: unknown;
};

export interface EthClient {
  [key: string]: unknown;
}

export type GetCalls = { getCalls: () => Call[] };
export type RecordingClient = PublicClient & GetCalls;

export const isEthereumApiMethod = (methodName: string) => methodName.startsWith('get');

export const createRecordingClient = (client: PublicClient): RecordingClient => createLoggingProxy(client);

function createLoggingProxy<Target extends EthClient>(target: Target): RecordingClient {
  const calls: Call[] = [];

  const handler: ProxyHandler<Target> = {
    get(target: Target, method: string, receiver) {
      if (method === 'getCalls') {
        return () => calls;
      }

      const originalMethod = target[method];
      if (typeof originalMethod === 'function' && isEthereumApiMethod(method)) {
        return async (...args: unknown[]): Promise<unknown> => {
          const result = await originalMethod.apply(target, args);
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
