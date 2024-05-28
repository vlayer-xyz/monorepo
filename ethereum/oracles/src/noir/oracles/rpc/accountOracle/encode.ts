import { ForeignCallOutput } from '@noir-lang/noir_js';
import { GetProofReturnType, Hex, fromRlp, isHex, keccak256, toRlp } from 'viem';
import { encodeField, encodeHex, encodeProof } from '../../common/encode.js';
import { padArray } from '../../../../util/array.js';
import { MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../../common/const.js';
import { assert } from '../../../../util/assert.js';
import { accountProofConfig } from '../common/proofConfig/account.js';
import { storageProofConfig } from '../common/proofConfig/storage.js';
import { toHexString } from '../../../../ethereum/blockHeader.js';

const RLP_VALUE_INDEX = 1;

export function encodeAccount(ethProof: GetProofReturnType): ForeignCallOutput[] {
  const nonce = encodeField(ethProof.nonce);
  const balance = encodeField(ethProof.balance);
  const storageRoot = encodeHex(ethProof.storageHash);
  const codeHash = encodeHex(ethProof.codeHash);

  return [nonce, balance, storageRoot, codeHash];
}

export function encodeStateProof(ethProof: GetProofReturnType): ForeignCallOutput {
  const key = padArray(
    encodeHex(keccak256(ethProof.address)),
    accountProofConfig.maxPrefixedKeyNibbleLen,
    ZERO_PAD_VALUE,
    'left'
  );
  const value = padArray(encodeValue(ethProof.accountProof), accountProofConfig.maxValueLen, ZERO_PAD_VALUE, 'left');
  const nodes = encodeProof(
    ethProof.accountProof.slice(0, ethProof.accountProof.length - 1),
    (accountProofConfig.maxProofDepth - 1) * MAX_TRIE_NODE_LEN
  );
  const leaf = padArray(
    encodeHex(ethProof.accountProof[ethProof.accountProof.length - 1]),
    accountProofConfig.maxLeafLen,
    ZERO_PAD_VALUE
  );
  const depth = encodeField(ethProof.accountProof.length);

  return [...key, ...value, ...nodes, ...leaf, depth];
}

export function getValue(proof: Hex[]): Hex {
  const lastProofEntry = fromRlp(proof[proof.length - 1], 'hex');
  const value = lastProofEntry[RLP_VALUE_INDEX];
  assert(isHex(value), 'value should be of type Hex');
  return value;
}

export function encodeValue(proof: Hex[]): string[] {
  return padArray(encodeHex(getValue(proof)), accountProofConfig.maxValueLen, ZERO_PAD_VALUE, 'left');
}

type StorageProof = GetProofReturnType['storageProof'][number];

export function encodeStorageProof(storageKey: Hex, storageProof: StorageProof): ForeignCallOutput {
  const key = padArray(
    encodeHex(keccak256(storageKey)),
    storageProofConfig.maxPrefixedKeyNibbleLen,
    ZERO_PAD_VALUE,
    'left'
  );
  const value = padArray(
    encodeHex(toRlp(toHexString(storageProof.value))),
    storageProofConfig.maxValueLen,
    ZERO_PAD_VALUE,
    'left'
  );
  const nodes = encodeProof(
    storageProof.proof.slice(0, storageProof.proof.length - 1),
    (storageProofConfig.maxProofDepth - 1) * MAX_TRIE_NODE_LEN
  );
  const leaf = padArray(
    encodeHex(storageProof.proof[storageProof.proof.length - 1]),
    storageProofConfig.maxLeafLen,
    ZERO_PAD_VALUE
  );
  const depth = encodeField(storageProof.proof.length);

  return [...key, ...value, ...nodes, ...leaf, depth];
}
