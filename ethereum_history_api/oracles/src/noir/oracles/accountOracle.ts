import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type Hex } from 'viem';
import { assert } from '../../util/assert.js';
import { encodeAccount, encodeStateProof } from './accountOracle/encode.js';
import { decodeAddress, decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';
import { Enum } from '../../util/enum.js';

export enum ARGS {
  BLOCK_NUM,
  ADDRESS
}

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
  assert(args.length === Enum.size(ARGS), `get_account requires ${Enum.size(ARGS)} arguments`);

  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[ARGS.BLOCK_NUM][0]);
  const address = decodeAddress(args[ARGS.ADDRESS]);

  return { blockNumber, address };
}
