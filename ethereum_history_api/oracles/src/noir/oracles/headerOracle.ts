import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type BlockHeader, blockToHeader } from '../../ethereum/blockHeader.js';
import { assert } from '../../util/assert.js';
import { encodeBlockHeader } from './headerOracle/encode.js';
import { decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { type Block } from '../../ethereum/blockHeader.js';
import { AlchemyClient } from '../../ethereum/client.js';
import { Enum } from '../../util/enum.js';

export enum ARGS {
  BLOCK_NUM
}

export async function getHeaderOracle(client: AlchemyClient, args: NoirArguments): Promise<ForeignCallOutput[]> {
  const blockNumber: bigint = decodeGetHeaderArguments(args);
  const blockHeader = await getBlockHeader(client, blockNumber);
  return encodeBlockHeader(blockHeader);
}

export function decodeGetHeaderArguments(args: NoirArguments): bigint {
  assert(args.length === Enum.size(ARGS), `get_header requires ${Enum.size(ARGS)} argument`);
  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  return decodeField(args[ARGS.BLOCK_NUM][0]);
}

export async function getBlockHeader(client: AlchemyClient, blockNumber: bigint): Promise<BlockHeader> {
  const block: Block = (await client.getBlock({ blockNumber })) as Block;
  return blockToHeader(block);
}
