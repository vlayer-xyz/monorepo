import { blockHeaders } from '../../test/fixtures/blockHeader.json';
import { BlockHeader } from '../ethereum/blockHeader.js';
import { encodeBlockHeaderPartial } from '../noir/oracles/headerOracle.js';

const partial = encodeBlockHeaderPartial(blockHeaders[1].header as BlockHeader);

console.log('stateRoot:', partial[0]);
console.log('transactionsRoot:', partial[1]);
console.log('receiptsRoot:', partial[2]);
console.log('number:', partial[3]);
console.log('encoded_len:', partial[4]);
console.log('encoded:');
console.dir(partial[5], { 'maxArrayLength': null });

