import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type BlockHeader, blockToHeader } from '../../ethereum/blockHeader.js';
import { type GetBlockReturnType, isHex, type PublicClient } from 'viem';
import { assert } from '../../util/assert.js';
import { NoirArguments } from './oracles.js';
import { decodeField } from './codec/decode.js';
import { encodeBlockHeader } from './headerOracle/codec.js';

export const MAX_HEADER_RLP_SIZE = 708;

export const getHeaderOracle = async (client: PublicClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const blockNumber: bigint = parseNoirGetHeaderArguments(args);
  const blockHeader: BlockHeader = await getBlock(client, blockNumber);

  return encodeBlockHeader(blockHeader);
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
