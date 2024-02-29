/* eslint-disable no-magic-numbers */
import { blockHeaders } from '../../fixtures/blockHeader.json';
import { assert } from '../util/assert.js';
import { type BlockHeader } from '../ethereum/blockHeader.js';
import { encodeBlockHeader } from '../noir/oracles/headerOracle.js';

const encodedBlockHeader = encodeBlockHeader(blockHeaders[1].header as BlockHeader);

function mapHexToInt(arr: string | string[]): number[] {
  assert(typeof arr !== 'string', 'Invalid input, expected hex array');
  return arr.map((hex) => (hex === '0x' ? 0 : parseInt(hex, 16)));
}

console.log('number:', encodedBlockHeader[0]);
console.log('hash:', mapHexToInt(encodedBlockHeader[1]));
console.log('stateRoot:', mapHexToInt(encodedBlockHeader[2]));
console.log('transactionsRoot:', mapHexToInt(encodedBlockHeader[3]));
console.log('receiptsRoot:', mapHexToInt(encodedBlockHeader[4]));
console.log('encoded_len:', encodedBlockHeader[5]);
console.log('encoded:');
console.dir(mapHexToInt(encodedBlockHeader[6]), { maxArrayLength: null });
