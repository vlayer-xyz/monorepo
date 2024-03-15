import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type Hex } from 'viem';
import { assert } from '../../util/assert.js';
import { encodeAccount, encodeStateProof } from './accountOracle/encode.js';
import { decodeAddress, decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';

const GET_ACCOUNT_ARGS_COUNT = 2;
const BLOCK_NUMBER_INDEX = 0;
const ADDRESS_INDEX = 1;

export async function getAccountOracle(client: AlchemyClient, args: NoirArguments): Promise<ForeignCallOutput[]> {
  const { blockNumber, address } = decodeGetAccountArguments(args);
  const accountProof = await client.getProof({
    address,
    storageKeys: [],
    blockNumber
  });
  const encodedAccount = encodeAccount(accountProof);
  const encodedProof = encodeStateProof(accountProof);
  return [...encodedAccount, ...encodedProof];
}

export function decodeGetAccountArguments(args: NoirArguments): {
  blockNumber: bigint;
  address: Hex;
} {
  assert(args.length === GET_ACCOUNT_ARGS_COUNT, 'get_account requires 2 arguments');

  assert(args[BLOCK_NUMBER_INDEX].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[BLOCK_NUMBER_INDEX][0]);
  const address = decodeAddress(args[ADDRESS_INDEX]);

  return { blockNumber, address };
}
