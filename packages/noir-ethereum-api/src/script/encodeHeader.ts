import { keccak256, hexToRlp, hexToBytes } from 'viem';
import { encodeHexString, encodeHexToBytes32 } from '../noir/encode.js';
import { blockHeaders } from '../../test/fixtures/blockHeader.json';
import { BlockHeader, encodeBlockHeader } from '../ethereum/blockHeader.js';
import { inspect } from 'util';

const MAX_HEADER_RLP_SIZE = 708;

function formatUint8Array(array: Uint8Array | number[]) {
    const core = array.map((item) => item).join(', ')
    return `[${core}]`;
}

function padRightUint8Array(array: Uint8Array, n: number) {
    const result = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = i < array.length ? array[i] : 0;
    }
    return result;
}

const block = blockHeaders[1].header;
const hex = encodeBlockHeader(block as BlockHeader)
const bytes = hexToBytes(hex);

console.log('let blockPartial = BlockHeaderPartial {');
console.log(`   stateRoot: ${formatUint8Array(encodeHexString(block.stateRoot))},`);
console.log(`   transactionsRoot: ${formatUint8Array(encodeHexString(block.transactionsRoot))},`);
console.log(`   receiptsRoot: ${formatUint8Array(encodeHexString(block.receiptsRoot))},`);
console.log(`   number: ${parseInt(block.number, 16)},`);
console.log(`   encoded_len: ${bytes.length},`);
console.log(`   encoded: ${formatUint8Array(padRightUint8Array(bytes, MAX_HEADER_RLP_SIZE))}\n\};`);

const keccak = encodeHexToBytes32(keccak256(bytes));
console.log(`let keccak: [u8; ${keccak.length}] = ${formatUint8Array(keccak)};`);
