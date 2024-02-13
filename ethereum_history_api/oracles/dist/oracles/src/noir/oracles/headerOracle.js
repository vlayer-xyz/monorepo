import { blockToHeader, headerToRlp } from '../../ethereum/blockHeader.js';
import { decodeField, encodeField, encodeHex } from './encode.js';
import { padArray } from '../../util/array.js';
import { hexToBytes, isHex, keccak256 } from 'viem';
import { assert } from '../../util/assert.js';
export const MAX_HEADER_RLP_SIZE = 708;
export const getHeaderOracle = async (client, args) => {
    const blockNumber = parseNoirGetHeaderArguments(args);
    const blockHeader = await getBlock(client, blockNumber);
    return encodeBlockHeaderPartial(blockHeader);
};
export function parseNoirGetHeaderArguments(args) {
    assert(args.length === 1, 'get_header requires 1 argument');
    assert(args[0].length === 1, 'get_account first argument must be an array of length 1');
    assert(isHex(args[0][0]), 'get_account first argument must be a hex value');
    return decodeField(args[0][0]);
}
export async function getBlock(client, blockNumber) {
    const block = (await client.getBlock({ blockNumber }));
    return blockToHeader(block);
}
export function encodeBlockHeaderPartial(header) {
    const stateRoot = encodeHex(header.stateRoot);
    const transactionsRoot = encodeHex(header.transactionsRoot);
    const receiptsRoot = encodeHex(header.receiptsRoot);
    const number = header.number;
    const rlpHex = headerToRlp(header);
    const rlpBytes = encodeHex(rlpHex);
    const encodedLen = encodeField(rlpBytes.length);
    const encoded = padArray(rlpBytes, MAX_HEADER_RLP_SIZE, '0x');
    const hash = encodeHex(keccak256(hexToBytes(rlpHex)));
    return [stateRoot, transactionsRoot, receiptsRoot, number, hash, encodedLen, encoded];
}
