# Noir Ethereum history api library

Noir library for proving and verifying historical data on the Ethereum blockchain and other EVMs.

**Disclaimer:** This page is supposed to give you an idea about the usage & structure of the library, but it's still a good idea to consult the code for exact definitions of functions & types.

## Usage

There are two main ways to use this library. `With Oracles` or `Without Oracles`.

### With oracles

If you decide to use Oracles - you don't need to provide all the data by hand and you can use functions that operate on a **high level of abstraction**. Those functions will then **fetch** required data such as raw header or state proofs from oracles, **verify** that the data is correct and return you the values that you've asked for.

Here is a list of public functions that you should use it you decide to go the `oracles route`:

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

Here is a list of public functions that you should use it you decide to go the `NO oracles route`:

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
