import { GetProofReturnType } from 'viem';
import { encodeHexString, joinArray } from '../../noir/noir_js/encode.js';
import { encodeValue } from '../../noir/oracles/rpc/accountOracle/encode.js';

export function createAccountFixture(stateProof: GetProofReturnType): string {
  const address = encodeHexString(stateProof.address);
  const balance = stateProof.balance;
  const storageHash = encodeHexString(stateProof.storageHash);
  const codeHash = encodeHexString(stateProof.codeHash);
  const value = encodeValue(stateProof.accountProof);
  const accountFixture = `use crate::account::Account;

global address = ${joinArray(address)};

global rlp_encoded_left_padded_account = ${joinArray(value)};

global nonce = ${stateProof.nonce};
global balance = ${balance};
global storage_root = ${joinArray(storageHash)};
global code_hash = ${joinArray(codeHash)};

global account = Account { nonce, balance, storage_root, code_hash };
`;
  return accountFixture;
}
