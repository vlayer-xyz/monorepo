import { blockHeaders } from '../../test/fixtures/blockHeader.json';
import { assert } from '../assert.js';
import { type BlockHeader } from '../ethereum/blockHeader.js';
import { encodeBlockHeaderPartial } from '../noir/oracles/headerOracle.js';

const partial = encodeBlockHeaderPartial(blockHeaders[1].header as BlockHeader);

function mapHexToInt(arr: string | string[]): number[] {
  assert(typeof arr !== 'string', 'Invalid input, expected hex array');
  return arr.map((hex) => (hex === '0x' ? 0 : parseInt(hex, 16)));
}

console.log('stateRoot:', mapHexToInt(partial[0]));
console.log('transactionsRoot:', mapHexToInt(partial[1]));
console.log('receiptsRoot:', mapHexToInt(partial[2]));
console.log('number:', partial[3]);
console.log('hash:', mapHexToInt(partial[4]));
console.log('encoded_len:', partial[5]);
console.log('encoded:');
console.dir(mapHexToInt(partial[6]), { maxArrayLength: null });
