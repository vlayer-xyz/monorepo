import { PublicClient } from 'viem';

export type CallResultEntry = {
  method: string;
  arguments: object[];
  result: Promise<object>;
};

export type AwaitedCallResultEntry = {
  method: string;
  arguments: object[];
  result: object;
};

export type GetCallResults = { getCallResults: () => Promise<AwaitedCallResultEntry[]> };

export const createRecordingClient = (client: PublicClient): PublicClient & GetCallResults =>
  createLoggingProxy(client);

function createLoggingProxy<T extends object>(target: T): T & GetCallResults {
  const handler: ProxyHandler<T> & { _callResults: CallResultEntry[] } = {
    _callResults: [],

    get(target: T, prop: string, receiver) {
      if (prop === 'getCallResults') {
        return async () => sequenceResultPromises(this._callResults);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const origMethod = (target as any)[prop];
      if (typeof origMethod === 'function' && prop.startsWith('get')) {
        return async (...args: object[]): Promise<object> => {
          const result = origMethod.apply(target, args);
          this._callResults.push({
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

  return new Proxy(target, handler) as T & GetCallResults;
}

async function sequenceResultPromises(entries: CallResultEntry[]): Promise<AwaitedCallResultEntry[]> {
  return Promise.all(entries.map(async (entry) => ({ ...entry, result: await entry.result })));
}
