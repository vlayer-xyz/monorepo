import { PublicClient } from 'viem';

export type RecordingEntry = {
  method: string;
  arguments: any[];
  result: Promise<object>;
};

export type AwaitedRecordingEntry = {
  method: string;
  arguments: any[];
  result: object;
};

export type GetRecordings = { getRecordings: () => Promise<AwaitedRecordingEntry[]> };

export const recordingClient = (client: PublicClient): PublicClient & GetRecordings => createLoggingProxy(client);

function createLoggingProxy<T extends object>(target: T): T & GetRecordings {
  const handler: ProxyHandler<T> & { _ethJsonRpcRecordings: RecordingEntry[] } = {
    _ethJsonRpcRecordings: [],

    get(target: T, prop: string, receiver) {
      if (prop === 'getRecordings') {
        return async () => sequenceResultPromises(this._ethJsonRpcRecordings);
      }

      const origMethod = (target as any)[prop];
      if (typeof origMethod === 'function' && prop.startsWith('get')) {
        return async (...args: any[]): Promise<any> => {
          const result = origMethod.apply(target, args);
          this._ethJsonRpcRecordings.push({
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

  return new Proxy(target, handler) as T & GetRecordings;
}

async function sequenceResultPromises(entries: RecordingEntry[]): Promise<AwaitedRecordingEntry[]> {
  return Promise.all(entries.map(async (entry) => ({ ...entry, result: await entry.result })));
}
