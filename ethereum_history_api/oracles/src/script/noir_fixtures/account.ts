import { GetProofReturnType } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeValue } from '../../noir/oracles/accountOracle/encode.js';

export function createAccountFixture(stateProof: GetProofReturnType): string {
  const balance = stateProof.balance;
  const storageHash = encodeHexString(stateProof.storageHash);
  const codeHash = encodeHexString(stateProof.codeHash);
  const value = encodeValue(stateProof.accountProof);
  const accountFixture = `use crate::account::Account;

global rlp_encoded_left_padded_account = [
  ${value.join(',')}
];

global nonce = ${stateProof.nonce};
global balance = ${balance};
global storage_root = [
    ${storageHash.join(',')}
];
global code_hash = [
    ${codeHash.join(',')}
];

global account = Account { nonce, balance, storage_root, code_hash };
`;
  return accountFixture;
}
