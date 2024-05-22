import { Proof } from '../../ethereum/proof.js';
import { LEGACY_MAX_TX_ENCODED_LEN, txProofConfigM } from '../../noir/oracles/common/proofConfig/tx.js';
import { BYTE_HEX_LEN } from '../../util/const.js';
import { createProofFixture } from './proof.js';

export function createTransactionProofFixture(proof: Proof): string {
  return createProofFixture(
    proof,
    txProofConfigM.maxKeyLen * BYTE_HEX_LEN,
    LEGACY_MAX_TX_ENCODED_LEN,
    txProofConfigM.maxProofLen,
    'dep::proof::trie_proof::TrieProof',
    'TrieProof'
  );
}
