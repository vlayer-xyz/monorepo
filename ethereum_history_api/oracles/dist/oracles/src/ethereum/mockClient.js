import { isEthereumApiMethod } from './recordingClient.js';
import { assert } from '../util/assert.js';
import { readObject } from '../util/file.js';
import { mock } from '../util/mock.js';
import isEqual from 'lodash.isequal';
import { identity } from '../util/function.js';
export async function createMockClient(filePath, resultModifier = identity) {
    const savedCalls = await readObject(filePath);
    return mock(isEthereumApiMethod, (method, args) => {
        const call = savedCalls.find((it) => it.method === method && isEqual(it.arguments, args));
        assert(!!call, `call not found for: ${method}(${args})`);
        return resultModifier(call).result;
    });
}
