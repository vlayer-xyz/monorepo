import { PublicClient } from 'viem';

type CallWithResultPromise = {
  method: string;
  arguments: object[];
  result: Promise<object>;
};

export type Call = {
  method: string;
  arguments: object[];
  result: object;
};

export type GetCalls = { getCalls: () => Promise<Call[]> };
type RecordingClient = PublicClient & GetCalls;

export const isEthereumApiMethod = (methodName: string) => methodName.startsWith('get');

export const createRecordingClient = (client: PublicClient): RecordingClient =>
  createLoggingProxy(client, isEthereumApiMethod);

function createLoggingProxy<Method, Target extends { [key: string]: Method }>(
  target: Target,
  propCondition: (prop: string) => boolean
): Target & GetCalls {
  const handler: ProxyHandler<Target> & { _calls: CallWithResultPromise[] } = {
    _calls: [],

    get(target: Target, prop: string, receiver) {
      if (prop === 'getCalls') {
        return async () => awaitResults(this._calls);
      }

      const origMethod = target[prop];
      if (typeof origMethod === 'function' && propCondition(prop)) {
        return async (...args: object[]): Promise<object> => {
          const result = origMethod.apply(target, args);
          this._calls.push({
            method: prop,
            arguments: args,
            result: result as Promise<object>
          });
          return result;
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  };

  return new Proxy(target, handler) as Target & GetCalls;
}

async function awaitResults(entries: CallWithResultPromise[]): Promise<Call[]> {
  return Promise.all(entries.map(async (entry) => ({ ...entry, result: await entry.result })));
}
