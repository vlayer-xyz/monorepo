import { Proof } from '../../ethereum/proof.js';
import { LEGACY_MAX_RECEIPT_ENCODED_LEN, ReceiptProofConfigM } from '../../noir/oracles/receiptOracle/encode.js';
import { BYTE_HEX_LEN } from '../../util/const.js';
import { createProofFixture } from './proof.js';

export function createReceiptProofFixture(proof: Proof): string {
  return createProofFixture(
    proof,
    ReceiptProofConfigM.MAX_KEY_LEN * BYTE_HEX_LEN,
    LEGACY_MAX_RECEIPT_ENCODED_LEN,
    ReceiptProofConfigM.MAX_PROOF_LEN,
    'dep::proof::trie_proof::TrieProof',
    'TrieProof'
  );
}
