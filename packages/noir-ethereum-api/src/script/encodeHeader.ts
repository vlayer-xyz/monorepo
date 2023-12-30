import { keccak256, hexToRlp, hexToBytes } from 'viem';
import { encodeHexToBytes32 } from '../noir/encode.js';
import { blockHeaders } from '../../test/fixtures/blockHeader.json';
import { BlockHeader, encodeBlockHeader } from '../ethereum/blockHeader.js';
import { inspect } from 'util';

const hex = encodeBlockHeader(blockHeaders[0].header as BlockHeader)

const rlp = hexToRlp(hex)
const bytes = hexToBytes(rlp);
console.log(`let input: [u8; ${bytes.length}] =`, inspect(bytes, { maxArrayLength: null }));

const keccak = keccak256(bytes)
const output = encodeHexToBytes32(keccak);
console.log(`let output:[u8; ${output.length}] =`, output);

