import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type Address } from 'viem';
import { assert } from '../../../util/assert.js';
import { encodeAccount, encodeStateProof } from './accountOracle/encode.js';
import { decodeAddress, decodeField } from '../common/decode.js';
import { NoirArguments } from '../types.js';
import { MultiChainClient } from '../../../ethereum/client.js';
import { Enum } from '../../../util/enum.js';

export enum ARGS {
  CHAIN_ID,
  BLOCK_NUM,
  ADDRESS
}

export enum OFFSETS {
  NONCE,
  BALANCE,
  STORAGE_ROOT,
  CODE_HASH,
  PROOF_INPUT
}

export async function getAccountOracle(
  multiChainClient: MultiChainClient,
  args: NoirArguments
): Promise<ForeignCallOutput[]> {
  const { blockNumber, address, chainId } = decodeGetAccountArguments(args);
  const client = multiChainClient.getClient(chainId);
  const accountProof = await client.getProof({
    address,
    storageKeys: [],
    blockNumber
  });
  const encodedAccount = encodeAccount(accountProof);
  const encodedProof = encodeStateProof(accountProof);
  return [...encodedAccount, encodedProof];
}

export function decodeGetAccountArguments(args: NoirArguments): {
  chainId: number;
  blockNumber: bigint;
  address: Address;
} {
  assert(args.length === Enum.size(ARGS), `get_account requires ${Enum.size(ARGS)} arguments`);

  assert(args[ARGS.CHAIN_ID].length === 1, 'chainId should be a single value');
  const chainId = Number(decodeField(args[ARGS.CHAIN_ID][0]));
  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[ARGS.BLOCK_NUM][0]);
  const address = decodeAddress(args[ARGS.ADDRESS]);

  return { blockNumber, address, chainId };
}
