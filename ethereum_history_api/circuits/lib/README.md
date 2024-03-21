# Noir Ethereum history api library

Noir library for proving and verifying historical data on the Ethereum blockchain and other EVMs.

**Disclaimer:** This page is supposed to give you an idea about the usage and structure of the library, but it's still a good idea to consult the code for exact definitions of functions & types.

## Usage

There are two main ways to use this library. **With Oracles** or **Without Oracles**.

### With oracles

#### Prerequisites

You will need to run an oracle server to use any of those functions. Consult [oracles docs](../../oracles/README.md#starting-oracle-server) for instructions.

If you decide to use our Oracles - you don't need to provide all the data by hand and you can use functions that operate on a **high level of abstraction**. Those functions will then **fetch** required data such as raw header or state proofs from oracles, **verify** that the data is correct and return you the values that you've asked for.

Here is a list of public functions that you should use it you decide to go the **oracles route**:

```rust
pub fn get_header(block_number: Field) -> BlockHeaderPartial;
```

```rust
pub fn get_account(block_no: Field, address: Address) -> AccountWithinBlock;
```

```rust
pub fn get_account_with_storage(block_number: Field, address: Address, storage_key: Bytes32) -> StorageWithinBlock<1>;
```

```rust
pub fn get_receipt<...>(block_number: Field, tx_idx: Field, ...) -> TxReceiptWithinBlock<...>;
```

### Without oracles

If you decide to not use Oracles - you will need to provide all the data manually, but you can still use verifier functions to verify data & proofs.

Here is a list of public functions that you should use it you decide to go the **NO oracles route**:

```rust
pub fn verify_header(chain_id: Field, block_header_partial: BlockHeaderPartial, block_header_rlp: BlockHeaderRlp)
```

```rust
pub fn verify_account(address: Address, account: Account, state_proof: StateProof, state_root: [u8; KEY_LENGTH])
```

```rust
pub fn verify_storage_value(storage_root: Bytes32, proof: StorageProof)
```

```rust
pub fn verify_storage_values<N>(storage_root: Bytes32, proofs: [StorageProof; N])
```

```rust
pub fn verify_receipt<...>(
    block_number: Field,
    tx_idx: Field,
    receipt: TxReceipt<LOG_NUM, MAX_LOG_DATA_SIZE>,
    receipt_proof: TxReceiptProof<MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_RLP_LENGTH>,
    receipt_root: [u8; KEY_LENGTH]
)
```

## Checking block hash

All the function in this library prove that the objects are contained within some block hash. We can't prove that this block hash is in fact a member of a canonical chain. This is user's responsibility. We provide Solidity [contract](../../contracts/src/EthereumHistoryVerifier.sol) that can prove block hash inclusion for the last 256 block on EVM and plan to maintain the Merkle Mountain Range on-chain in the future to allow for historical block hash inclusion proofs.

For now - just remember that it's your responsibility to prove block hash. Otherwise - an attacker can generate valid proofs for non-existent blocks.

## Package structure

```sh
└── src
    ├── header.nr
    ├── receipt.nr
    ├── account.nr
    ├── account_with_storage.nr
    └── verifiers
        ├── header.nr
        ├── receipt.nr
        ├── account.nr
        └── storage.nr
```
