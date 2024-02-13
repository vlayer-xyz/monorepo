import { createDefaultClient } from '../../ethereum/client.js';
import { getAccountOracle } from './accountOracles.js';
import { getHeaderOracle } from './headerOracle.js';
export const createOracles = (client) => (dict) => async (name, args) => {
    const fn = dict[name];
    if (fn === undefined) {
        throw new Error(`Unknown oracle ${name}`);
    }
    return await fn(client, args);
};
export const defaultOraclesMap = {
    get_account: getAccountOracle,
    get_header: getHeaderOracle
};
export const defaultOracles = createOracles(createDefaultClient())(defaultOraclesMap);
