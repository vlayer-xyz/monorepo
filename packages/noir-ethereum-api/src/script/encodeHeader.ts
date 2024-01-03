import { blockHeaders } from '../../test/fixtures/blockHeader.json';
import { padArrayRight } from '../arrays.js';
import { BlockHeader, encodeBlockHeader } from '../ethereum/blockHeader.js';
import { encodeHex } from '../noir/encode.js';
import { MAX_HEADER_RLP_SIZE } from '../noir/oracles/headerOracle.js';

const block = blockHeaders[1].header;
const hex = encodeBlockHeader(block as BlockHeader)
const bytes = encodeHex(hex);
const encoded = padArrayRight(bytes, MAX_HEADER_RLP_SIZE, "0x");

console.log('stateRoot: ', encodeHex(block.stateRoot));
console.log('transactionsRoot: ', encodeHex(block.transactionsRoot));
console.log('receiptsRoot: ', encodeHex(block.receiptsRoot));
console.log('number: ', parseInt(block.number, 16));
console.log('encoded_len: ', encoded.length);
console.log('encoded: ');
console.dir(encoded, { 'maxArrayLength': null });
