import { getAccountOracle } from '../accountOracles.js';
import { getHeaderOracle } from '../headerOracle.js';
import { decodeNoirArguments, encodeForeignCallResult } from './encode.js';
export async function getHeaderHandler(params, { client }) {
    const noirArguments = decodeNoirArguments(params);
    const noirOutputs = await getHeaderOracle(client, noirArguments);
    const result = encodeForeignCallResult(noirOutputs);
    return result;
}
export async function getAccountHandler(params, { client }) {
    const noirArguments = decodeNoirArguments(params);
    const noirOutputs = await getAccountOracle(client, noirArguments);
    const result = encodeForeignCallResult(noirOutputs);
    return result;
}
