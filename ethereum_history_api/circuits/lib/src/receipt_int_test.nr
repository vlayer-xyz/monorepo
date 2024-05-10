use crate::receipt::{get_receipt, TxReceiptWithinBlock, PhantomReceiptProofLen, PhantomReceiptRlpLen};
use crate::fixtures::mainnet::{
    cancun::small_block::{
    header::{number, block_header_partial, block_header_rlp},
    receipt::{tx_type, receipt, foreign_call_receipt}, transaction::tx_idx, receipt_proof::proof
},
    homestead::fork::{
    header::{
    number as another_number, block_header_partial as another_block_header_partial,
    block_header_rlp as another_block_header_rlp
},
    transaction::{
    tx_idx as another_tx_idx, tx_type as another_tx_type,
    foreign_call_transaction as another_foreign_call_transaction
},
    transaction_proof::proof as another_proof
}
};
use dep::std::test::OracleMock;
use crate::chain::ETHEREUM_MAINNET_ID;

global phantom_receipt_proof_len: PhantomReceiptProofLen<3724> = PhantomReceiptProofLen {}; //= 7 (MAX_TREE_DEPTH) * 532 (MAX_TRIE_NODE_LEN)
global phantom_receipt_rlp_len: PhantomReceiptRlpLen<525> = PhantomReceiptRlpLen {};

#[test]
fn get_receipt_success() {
    let _ = OracleMock::mock("get_header").returns((block_header_partial, block_header_rlp));
    let _ = OracleMock::mock("get_receipt").returns((tx_type, foreign_call_receipt, proof));

    let receipt_within_block: TxReceiptWithinBlock = get_receipt(
        ETHEREUM_MAINNET_ID,
        number,
        tx_idx,
        phantom_receipt_proof_len,
        phantom_receipt_rlp_len
    );

    assert_eq(receipt_within_block.block_hash, block_header_partial.hash);
    assert_eq(receipt_within_block.receipt, foreign_call_receipt.into());
}
