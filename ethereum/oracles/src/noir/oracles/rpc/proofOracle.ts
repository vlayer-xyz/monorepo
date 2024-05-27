import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../../util/assert.js';
import { encodeAccount, encodeStateProof, encodeStorageProof } from './accountOracle/encode.js';
import { decodeAddress, decodeBytes32, decodeField } from '../common/decode.js';
import { NoirArguments } from '../types.js';
import { Hex } from 'viem';
import { MultiChainClient } from '../../../ethereum/client.js';
import { Enum } from '../../../util/enum.js';

export enum ARGS {
  CHAIN_ID,
  BLOCK_NUM,
  ADDRESS,
  STORAGE_KEY
}

export const getProofOracle = async (
  multiChainClient: MultiChainClient,
  args: NoirArguments
): Promise<ForeignCallOutput[]> => {
  const { blockNumber, address, storageKey, chainId } = decodeGetProofArguments(args);
  const client = multiChainClient.getClient(chainId);
  const accountProof = await client.getProof({
    address,
    storageKeys: [storageKey],
    blockNumber
  });
  const encodedAccount = encodeAccount(accountProof);
  const encodedStateProof = encodeStateProof(accountProof);
  const encodedStorageProof = encodeStorageProof(storageKey, accountProof.storageProof[0]);
  return [...encodedAccount, encodedStateProof, encodedStorageProof];
};

export function decodeGetProofArguments(args: NoirArguments): {
  chainId: number;
  blockNumber: bigint;
  address: Hex;
  storageKey: Hex;
} {
  assert(args.length === Enum.size(ARGS), `get_proof requires ${Enum.size(ARGS)} arguments`);

  assert(args[ARGS.CHAIN_ID].length === 1, 'chainId should be a single value');
  const chainId = Number(decodeField(args[ARGS.CHAIN_ID][0]));
  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[ARGS.BLOCK_NUM][0]);
  const address = decodeAddress(args[ARGS.ADDRESS]);
  const storageKey = decodeBytes32(args[ARGS.STORAGE_KEY]);

  return { blockNumber, address, storageKey, chainId };
}
