import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { fromRlp, type GetProofReturnType, type Hex, isHex, type PublicClient } from 'viem';
import { assert } from '../../util/assert.js';
import {
  ADDRESS_LENGTH,
  PROOF_ONE_LEVEL_LENGTH,
  ZERO_PAD_VALUE,
  decodeField,
  decodeHexAddress,
  encodeField,
  encodeHex,
  encodeProof
} from './encode.js';
import { padArray } from '../../util/array.js';
import { NoirArguments } from './oracles.js';

const MAX_STATE_PROOF_LEVELS = 9;
export const STATE_PROOF_LENGTH = PROOF_ONE_LEVEL_LENGTH * MAX_STATE_PROOF_LEVELS;
const MAX_ACCOUNT_STATE_LENGTH = 134;
const RLP_VALUE_INDEX = 1;
const GET_ACCOUNT_ARGS_COUNT = 2;

export const getAccountOracle = async (client: PublicClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const { blockNumber, address } = parseNoirGetAccountArguments(args);
  const accountProof = await client.getProof({
    address,
    storageKeys: [],
    blockNumber
  });
  const encodedAccount = encodeAccount(accountProof);
  const encodedProof = encodeStateProof(accountProof);
  return [...encodedAccount, ...encodedProof];
};

export function parseNoirGetAccountArguments(args: NoirArguments): {
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

export function encodeAccount(ethProof: GetProofReturnType): ForeignCallOutput[] {
  const nonce = encodeField(ethProof.nonce);
  const balance = encodeField(ethProof.balance);
  const storageRoot = encodeHex(ethProof.storageHash);
  const codeHash = encodeHex(ethProof.codeHash);

  return [nonce, balance, storageRoot, codeHash];
}

export function encodeStateProof(ethProof: GetProofReturnType): ForeignCallOutput[] {
  const key = encodeHex(ethProof.address);
  const value = encodeValue(ethProof.accountProof);
  const proof = encodeProof(ethProof.accountProof, STATE_PROOF_LENGTH);
  const depth = encodeField(ethProof.accountProof.length);

  return [key, value, proof, depth];
}

export function encodeValue(proof: Hex[]): string[] {
  const lastProofEntry = fromRlp(proof[proof.length - 1], 'hex');
  const value = lastProofEntry[RLP_VALUE_INDEX];
  assert(isHex(value), 'value should be of type Hex');
  return padArray(encodeHex(value), MAX_ACCOUNT_STATE_LENGTH, ZERO_PAD_VALUE, 'left');
}
