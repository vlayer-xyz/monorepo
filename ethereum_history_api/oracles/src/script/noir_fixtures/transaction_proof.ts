import { Proof } from '../../ethereum/proof.js';
import { LEGACY_MAX_TX_ENCODED_LEN, TxProofConfigM } from '../../noir/oracles/transactionOracle/encode.js';
import { BYTE_HEX_LEN } from '../../util/const.js';
import { createProofFixture } from './proof.js';

export function createTransactionProofFixture(proof: Proof): string {
  return createProofFixture(
    proof,
    TxProofConfigM.MAX_KEY_LEN * BYTE_HEX_LEN,
    LEGACY_MAX_TX_ENCODED_LEN,
    TxProofConfigM.MAX_PROOF_LEN,
    'dep::proof::trie_proof::TrieProof',
    'TrieProof'
  );
}
