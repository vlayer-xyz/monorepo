import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type BlockHeader, blockToHeader, headerToRlp } from '../../ethereum/blockHeader.js';
import { decodeField, encodeField, encodeHex } from './encode.js';
import { padArray } from '../../util/array.js';
import { type GetBlockReturnType, hexToBytes, isHex, keccak256, type PublicClient } from 'viem';
import { assert } from '../../util/assert.js';
import { NoirArguments } from './oracles.js';

export const MAX_HEADER_RLP_SIZE = 708;

export const getHeaderOracle = async (client: PublicClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const blockNumber: bigint = parseNoirGetHeaderArguments(args);
  const blockHeader: BlockHeader = await getBlock(client, blockNumber);

  const partial = encodeBlockHeaderPartial(blockHeader);
  const rlp = encodeBlockHeaderRlp(blockHeader);

  return [...partial, ...rlp];
};

export function parseNoirGetHeaderArguments(args: NoirArguments): bigint {
  assert(args.length === 1, 'get_header requires 1 argument');
  assert(args[0].length === 1, 'get_account first argument must be an array of length 1');
  assert(isHex(args[0][0]), 'get_account first argument must be a hex value');
  return decodeField(args[0][0]);
}

export async function getBlock(client: PublicClient, blockNumber: bigint): Promise<BlockHeader> {
  const block: GetBlockReturnType = (await client.getBlock({ blockNumber })) as GetBlockReturnType;
  return blockToHeader(block);
}

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
  const encodedRlp = padArray(rlpBytes, MAX_HEADER_RLP_SIZE, '0x');
  return [encodedRlpLen, encodedRlp];
}
