import { GetProofReturnType } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeValue } from '../../noir/oracles/accountOracles.js';

export function createAccountFixture(stateProof: GetProofReturnType): string {
  const balance = '0x' + stateProof.balance.toString(16);
  const storageHash = encodeHexString(stateProof.storageHash);
  const codeHash = encodeHexString(stateProof.codeHash);
  const value = encodeValue(stateProof.accountProof).map((byte) => parseInt(byte, 16));
  const accountFixture = `use crate::account::Account;

global rlp_encoded_left_padded_account = [
  ${value}
];

global nonce: u64 = ${stateProof.nonce};
global balance: u120 = ${balance};
global storage_root = [
    ${storageHash}
];
global code_hash = [
    ${codeHash}
];

global account = Account { nonce, balance, storage_root, code_hash };
`;
  return accountFixture;
}
