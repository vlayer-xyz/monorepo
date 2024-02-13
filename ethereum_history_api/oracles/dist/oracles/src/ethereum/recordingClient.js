export const isEthereumApiMethod = (methodName) => methodName.startsWith('get');
export const createRecordingClient = (client) => createLoggingProxy(client, isEthereumApiMethod);
function createLoggingProxy(target, propCondition) {
    const handler = {
        _calls: [],
        get(target, prop, receiver) {
            if (prop === 'getCalls') {
                return async () => awaitResults(this._calls);
            }
            const origMethod = target[prop];
            if (typeof origMethod === 'function' && propCondition(prop)) {
                return async (...args) => {
                    const result = origMethod.apply(target, args);
                    this._calls.push({
                        method: prop,
                        arguments: args,
                        result: result
                    });
                    return result;
                };
            }
            return Reflect.get(target, prop, receiver);
        }
    };
    return new Proxy(target, handler);
}
async function awaitResults(entries) {
    return Promise.all(entries.map(async (entry) => ({ ...entry, result: await entry.result })));
}
