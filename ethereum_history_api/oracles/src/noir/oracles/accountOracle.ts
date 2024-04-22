import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type Hex } from 'viem';
import { assert } from '../../util/assert.js';
import { encodeAccount, encodeStateProof } from './accountOracle/encode.js';
import { decodeAddress, decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';
import { ENUM_LEN_TO_ENUM_KEY_LEN_RATIO } from '../../util/const.js';

export enum ARGS {
  BLOCK_NUM,
  ADDRESS
}
const ARGS_COUNT = Object.keys(ARGS).length / ENUM_LEN_TO_ENUM_KEY_LEN_RATIO;

export enum OFFSETS {
  NONCE,
  BALANCE,
  STORAGE_ROOT,
  CODE_HASH,
  PROOF_KEY,
  PROOF_VALUE,
  PROOF,
  PROOF_DEPTH
}

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
  assert(args.length === ARGS_COUNT, `get_account requires ${ARGS_COUNT} arguments`);

  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[ARGS.BLOCK_NUM][0]);
  const address = decodeAddress(args[ARGS.ADDRESS]);

  return { blockNumber, address };
}
