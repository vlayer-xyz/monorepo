import { Proof } from '../../ethereum/proof.js';
import {
  LEGACY_MAX_RECEIPT_ENCODED_LEN,
  receiptProofConfigM
} from '../../noir/oracles/rpc/common/proofConfig/receipt.js';
import { BYTE_HEX_LEN } from '../../util/const.js';
import { createProofFixture } from './proof.js';

export function createReceiptProofFixture(proof: Proof): string {
  return createProofFixture(
    proof,
    receiptProofConfigM.maxKeyLen * BYTE_HEX_LEN,
    LEGACY_MAX_RECEIPT_ENCODED_LEN,
    receiptProofConfigM.maxProofLen,
    'dep::proof::trie_proof::TrieProof',
    'TrieProof'
  );
}
