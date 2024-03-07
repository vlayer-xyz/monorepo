import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type Hex, isHex, type PublicClient } from 'viem';
import { assert } from '../../util/assert.js';
import { NoirArguments } from './oracles.js';
import { ADDRESS_LENGTH } from './codec/const.js';
import { decodeField, decodeHexAddress } from './codec/decode.js';
import { encodeAccount, encodeStateProof } from './accountOracle/encode.js';

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

  const [noirBlockNumber, noirAddress] = args;

  assert(noirBlockNumber.length === 1, 'get_account first argument must be an array of length 1');
  assert(isHex(noirBlockNumber[0]), 'get_account first argument must be a hex value');

  assert(noirAddress.length === ADDRESS_LENGTH, 'get_account second argument must be an address');
  assert(
    noirAddress.every((it) => isHex(it)),
    'get_account second argument must be an array of hex string values'
  );

  const blockNumber: bigint = decodeField(noirBlockNumber[0]);
  const address: Hex = decodeHexAddress(noirAddress);

  return { blockNumber, address };
}
