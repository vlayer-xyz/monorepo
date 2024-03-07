import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type Hex, type PublicClient } from 'viem';
import { assert } from '../../util/assert.js';
import { encodeAccount, encodeStateProof } from './accountOracle/encode.js';
import { decodeField, decodeHexAddress } from './codec/decode.js';
import { NoirArguments } from './oracles.js';

const GET_ACCOUNT_ARGS_COUNT = 2;

export const getAccountOracle = async (client: PublicClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const { blockNumber, address } = decodeGetAccountArguments(args);
  const accountProof = await client.getProof({
    address,
    storageKeys: [],
    blockNumber
  });
  const encodedAccount = encodeAccount(accountProof);
  const encodedProof = encodeStateProof(accountProof);
  return [...encodedAccount, ...encodedProof];
};

export function decodeGetAccountArguments(args: NoirArguments): {
  blockNumber: bigint;
  address: Hex;
} {
  assert(args.length === GET_ACCOUNT_ARGS_COUNT, 'get_account requires 2 arguments');

  assert(args[0].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[0][0]);
  const address = decodeHexAddress(args[1]);

  return { blockNumber, address };
}
