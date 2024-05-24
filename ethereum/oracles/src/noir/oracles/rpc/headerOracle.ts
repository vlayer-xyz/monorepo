import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type BlockHeader, blockToHeader } from '../../../ethereum/blockHeader.js';
import { assert } from '../../../util/assert.js';
import { encodeBlockHeader } from './headerOracle/encode.js';
import { decodeField } from '../common/decode.js';
import { NoirArguments } from '../types.js';
import { type Block } from '../../../ethereum/blockHeader.js';
import { AlchemyClient, MultiChainClient } from '../../../ethereum/client.js';
import { Enum } from '../../../util/enum.js';

export enum ARGS {
  CHAIN_ID,
  BLOCK_NUM
}

export async function getHeaderOracle(
  multiChainClient: MultiChainClient,
  args: NoirArguments
): Promise<ForeignCallOutput[]> {
  const { blockNumber, chainId } = decodeGetHeaderArguments(args);
  const client = multiChainClient.getClient(chainId);
  const blockHeader = await getBlockHeader(client, blockNumber);
  return encodeBlockHeader(blockHeader);
}

export function decodeGetHeaderArguments(args: NoirArguments): {
  chainId: number;
  blockNumber: bigint;
} {
  assert(args.length === Enum.size(ARGS), `get_header requires ${Enum.size(ARGS)} argument`);
  assert(args[ARGS.CHAIN_ID].length === 1, 'chainId should be a single value');
  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  return { chainId: Number(decodeField(args[ARGS.CHAIN_ID][0])), blockNumber: decodeField(args[ARGS.BLOCK_NUM][0]) };
}

export async function getBlockHeader(client: AlchemyClient, blockNumber: bigint): Promise<BlockHeader> {
  const block: Block = (await client.getBlock({ blockNumber })) as Block;
  return blockToHeader(block);
}
