import { GetProofReturnType } from 'viem';
import { encodeHexString, joinArray } from '../../noir/noir_js/encode.js';
import { encodeValue } from '../../noir/oracles/accountOracle/encode.js';

export function createAccountFixture(stateProof: GetProofReturnType): string {
  const balance = stateProof.balance;
  const storageHash = encodeHexString(stateProof.storageHash);
  const codeHash = encodeHexString(stateProof.codeHash);
  const value = encodeValue(stateProof.accountProof);
  const accountFixture = `use crate::account::Account;

global rlp_encoded_left_padded_account = ${joinArray(value)};

global nonce = ${stateProof.nonce};
global balance = U128::from_integer(${balance});
global storage_root = ${joinArray(storageHash)};
global code_hash = ${joinArray(codeHash)};

global account = Account { nonce, balance, storage_root, code_hash };
`;
  return accountFixture;
}
