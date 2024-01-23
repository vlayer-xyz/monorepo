import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { fromRlp, type GetProofReturnType, type Hex, isHex, type PublicClient } from 'viem';
import { assert } from '../../util/assert.js';
import { decodeField, decodeHexAddress, encodeField, encodeHex } from '../encode.js';
import { padArray } from '../../util/array.js';
import { NoirArguments } from './oracles.js';

const PROOF_ONE_LEVEL_LENGTH = 532;
// NOTE(Leo): Proofs can have different lengths depending on the depth of the tree.
// Unfortunately now we have proof len hardcoded in a circuit as 4256 which is 532 * 8.
// So before it's fixed - we hardcode it here too.
const PROOF_LEVELS = 8;
const PROOF_LENGTH = PROOF_ONE_LEVEL_LENGTH * PROOF_LEVELS;
const MAX_ACCOUNT_STATE_LENGTH = 134;
const ZERO_PAD_VALUE = '0x0';
const RLP_VALUE_INDEX = 1;

export const getAccountOracle = async (client: PublicClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const { blockNumber, address } = parseNoirGetAccountArguments(args);
  const accountProof = await client.getProof({
    address,
    storageKeys: [],
    blockNumber
  });
  return encodeAccount(accountProof);
};

export function parseNoirGetAccountArguments(args: NoirArguments): {
  blockNumber: bigint;
  address: Hex;
} {
  assert(args.length === 2, 'get_account requires 2 arguments');

  const [noirBlockNumber, noirAddress] = args;

  assert(noirBlockNumber.length === 1, 'get_account first argument must be an array of length 1');
  assert(isHex(noirBlockNumber[0]), 'get_account first argument must be a hex value');

  assert(noirAddress.length === 20, 'get_account second argument must be an address');
  assert(
    noirAddress.every((it) => isHex(it)),
    'get_account second argument must be an array of hex string values'
  );

  const blockNumber: bigint = decodeField(noirBlockNumber[0]);
  const address: Hex = decodeHexAddress(noirAddress);

  return { blockNumber, address };
}

export function encodeAccount(ethProof: GetProofReturnType): ForeignCallOutput[] {
  const balance = encodeField(ethProof.balance);
  const codeHash = encodeHex(ethProof.codeHash);
  const nonce = encodeField(ethProof.nonce);
  const key = encodeHex(ethProof.address);
  const value = encodeValue(ethProof.accountProof);
  const proof = encodeProof(ethProof.accountProof);
  const depth = encodeField(ethProof.accountProof.length);
  return [balance, codeHash, nonce, key, value, proof, depth];
}

function encodeProof(proof: string[]): string[] {
  const encodedUnpaddedProof = proof
    .map((it) => encodeHex(it))
    .map((it) => padArray(it, PROOF_ONE_LEVEL_LENGTH, ZERO_PAD_VALUE))
    .reduce((accumulator, current) => accumulator.concat(current), []);
  const encodedProof = padArray(encodedUnpaddedProof, PROOF_LENGTH, ZERO_PAD_VALUE);
  return encodedProof;
}

function encodeValue(proof: Hex[]): string[] {
  const lastProofEntry = fromRlp(proof[proof.length - 1], 'hex');
  const value = lastProofEntry[RLP_VALUE_INDEX];
  assert(isHex(value), 'value should be of type Hex');
  return padArray(encodeHex(value), MAX_ACCOUNT_STATE_LENGTH, ZERO_PAD_VALUE, 'left');
}
