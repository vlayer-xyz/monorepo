import { ForeignCallOutput } from '@noir-lang/noir_js';
import { hexToBytes, keccak256 } from 'viem';
import { BlockHeader, headerToRlp } from '../../../../ethereum/blockHeader.js';
import { padArray } from '../../../../util/array.js';
import { encodeField, encodeHex } from '../../common/encode.js';

export const MAX_HEADER_RLP_LEN = 708;

export function encodeBlockHeader(header: BlockHeader): ForeignCallOutput[] {
  return [...encodeBlockHeaderPartial(header), ...encodeBlockHeaderRlp(header)];
}

function encodeBlockHeaderPartial(header: BlockHeader): ForeignCallOutput[] {
  const rlpHex = headerToRlp(header);

  const number = header.number;
  const hash = encodeHex(keccak256(hexToBytes(rlpHex)));
  const stateRoot = encodeHex(header.stateRoot);
  const transactionsRoot = encodeHex(header.transactionsRoot);
  const receiptsRoot = encodeHex(header.receiptsRoot);
  return [number, hash, stateRoot, transactionsRoot, receiptsRoot];
}

function encodeBlockHeaderRlp(header: BlockHeader): ForeignCallOutput[] {
  const rlpHex = headerToRlp(header);
  const rlpBytes = encodeHex(rlpHex);

  const encodedRlpLen = encodeField(rlpBytes.length);
  const encodedRlp = padArray(rlpBytes, MAX_HEADER_RLP_LEN, '0x');
  return [encodedRlp, encodedRlpLen];
}
