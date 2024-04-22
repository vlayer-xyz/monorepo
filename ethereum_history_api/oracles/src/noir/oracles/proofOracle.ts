import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../util/assert.js';
import { encodeAccount, encodeStateProof, encodeStorageProof } from './accountOracle/encode.js';
import { decodeAddress, decodeBytes32, decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { Hex } from 'viem';
import { AlchemyClient } from '../../ethereum/client.js';
import { ENUM_LEN_TO_ENUM_KEY_LEN_RATIO } from '../../util/const.js';

export enum ARGS {
  BLOCK_NUM,
  ADDRESS,
  STORAGE_KEY
}
const ARGS_COUNT = Object.keys(ARGS).length / ENUM_LEN_TO_ENUM_KEY_LEN_RATIO;

export const getProofOracle = async (client: AlchemyClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const { blockNumber, address, storageKey } = decodeGetProofArguments(args);
  const accountProof = await client.getProof({
    address,
    storageKeys: [storageKey],
    blockNumber
  });
  const encodedAccount = encodeAccount(accountProof);
  const encodedStateProof = encodeStateProof(accountProof);
  const encodedStorageProof = encodeStorageProof(storageKey, accountProof.storageProof[0]);
  return [...encodedAccount, ...encodedStateProof, ...encodedStorageProof];
};

export function decodeGetProofArguments(args: NoirArguments): {
  blockNumber: bigint;
  address: Hex;
  storageKey: Hex;
} {
  assert(args.length === ARGS_COUNT, `get_proof requires ${ARGS_COUNT} arguments`);

  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[ARGS.BLOCK_NUM][0]);
  const address = decodeAddress(args[ARGS.ADDRESS]);
  const storageKey = decodeBytes32(args[ARGS.STORAGE_KEY]);

  return { blockNumber, address, storageKey };
}
