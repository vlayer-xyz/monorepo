import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../util/assert.js';
import { encodeAccount, encodeStateProof, encodeStorageProof } from './accountOracle/encode.js';
import { decodeAddress, decodeBytes32, decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { Hex } from 'viem';
import { AlchemyClient } from '../../ethereum/client.js';

const GET_PROOF_ARGS_COUNT = 3;
const BLOCK_NUMBER_INDEX = 0;
const ADDRESS_INDEX = 1;
const STORAGE_KEY_INDEX = 2;

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
  assert(args.length === GET_PROOF_ARGS_COUNT, `get_proof requires ${GET_PROOF_ARGS_COUNT} arguments`);

  assert(args[BLOCK_NUMBER_INDEX].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[BLOCK_NUMBER_INDEX][0]);
  const address = decodeAddress(args[ADDRESS_INDEX]);
  const storageKey = decodeBytes32(args[STORAGE_KEY_INDEX]);

  return { blockNumber, address, storageKey };
}
