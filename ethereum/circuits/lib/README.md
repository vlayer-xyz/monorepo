# Noir Ethereum history api library

Noir library for proving and verifying historical data on the Ethereum blockchain and other EVMs.

**Disclaimer:** This page is supposed to give you an idea about the usage and structure of the library, but it's still a good idea to consult the code for exact definitions of functions & types.

**Note:** This library also contains two sublibraries: _rlp_ for RLP-decoding and _merkle_patricia_proofs_ for verifying merkle patricia proofs. To learn more about them follow the links below:

- [rlp](./src/rlp/README.md)
- [merkle_patricia_proofs](./src/merkle_patricia_proofs/README.md)

## Usage

There are two main ways to use this library. **With Oracles** or **Without Oracles**.

### With oracles

#### Prerequisites

You will need to run an oracle server to use any of those functions. Consult [oracles docs](../../oracles/README.md#starting-oracle-server) for instructions.

If you decide to use our Oracles - you don't need to provide all the data by hand and you can use functions that operate on a **high level of abstraction**. Those functions will then **fetch** required data such as raw header or state proofs from oracles, **verify** that the data is correct and return you the values that you've asked for.

Here is a list of public functions that you should use if you decide to go the **oracles route**:

```rust
pub fn get_header(chain_id: Field, block_number: u64) -> BlockHeaderPartial;
```

```rust
pub fn get_account(chain_id: Field, block_no: u64, address: Address) -> AccountWithinBlock;
```

```rust
pub fn get_account_with_storage(chain_id: Field, block_number: u64, address: Address, storage_key: Bytes32) -> StorageWithinBlock<1>;
```

```rust
pub fn get_receipt<...>(chain_id: Field, block_number: u64, tx_idx: Field, ...) -> TxReceiptWithinBlock;
```

```rust
pub fn get_transaction<MAX_DATA_LEN, ...>(
    chain_id: Field,
    block_number: u64,
    tx_idx: Field,
    ...
) -> TransactionWithinBlock<MAX_DATA_LEN>;
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
pub fn verify_receipt<MAX_RECEIPT_PROOF_LEN>(
    block_number: Field,
    tx_idx: Field,
    tx_type: TxType,
    receipt: TxReceiptPartial,
    receipt_proof: ReceiptProof<MAX_RECEIPT_PROOF_LEN>,
    receipt_root: [u8; KEY_LENGTH]
)
```

```rust
pub fn verify_tx<MAX_DATA_LEN, MAX_PROOF_LEN>(
    tx_idx: Field,
    tx_type: TxType,
    tx: TxPartial<MAX_DATA_LEN>,
    tx_proof: TransactionProof<MAX_PROOF_LEN>,
    tx_root: [u8; HASH_LENGTH]
)
```

## Checking block hash

All the function in this library prove that the objects are contained within some block hash. We can't prove that this block hash is in fact a member of a canonical chain. This is user's responsibility. We provide Solidity [contract](../../contracts/src/EthereumHistoryVerifier.sol) that can prove block hash inclusion for the last 256 block on EVM and plan to maintain the Merkle Mountain Range on-chain in the future to allow for historical block hash inclusion proofs.

> [!CAUTION]
> Remember that it's your responsibility to prove block hash belongs to the chain. Otherwise - an attacker can generate valid proofs for non-existent blocks.

## Package structure

```sh
└── src
    ├── header.nr
    ├── receipt.nr
    ├── account.nr
    ├── account_with_storage.nr
    ├── transaction.nr
    ├── uint256.nr
    └── verifiers
        ├── header.nr
        ├── receipt.nr
        ├── account.nr
        ├── transaction.nr
        └── storage.nr
    ├── merkle_patricia_proofs
    └── rlp
```

## Generic parameters

We use generics so that your circuits can be the exact size they need to be.

Let's say - you need to prove some storage values. We could give you a function that proves up to 5 storage values and you can call it with one real key and 4 fake keys that would be proven to be zero, but it would be wasteful.
Or we could give you a set of functions:
`get_account_with_storage1`, `get_account_with_storage2`, ...
That's also not a nice solution. Instead - we try to introduce generic parameters for sizes where we can and ask you to provide them before generating actual proof.

Unfortunately generics are limited:

- We can't do any [arithmetic](https://github.com/noir-lang/noir/issues/1837) on them. It's impossible to create `array: [u8; N * M]` where N and M are generic type parameters
- [Turbofish syntax](https://github.com/orgs/noir-lang/discussions/3413) is not supported. You can only specify generics that are used in input/output values. So if we need you to provide proof size - we need to resort to [phantom arguments](https://github.com/orgs/noir-lang/discussions/3413#discussioncomment-8774114)

## Types

This section describes the types that are used in function signatures above. Please consult the section above for generics motivation.

```rust
type Address = [u8; 20];
type Bytes32 = [u8; 32];
```

```rust
struct BlockHeaderPartial {
    number: u64,
    hash: Bytes32,
    state_root: Bytes32,
    transactions_root: Bytes32,
    receipts_root: Bytes32,
}
```

```rust
struct Account {
    nonce: u64,
    balance: Field,
    storage_root: Bytes32,
    code_hash: Bytes32,
}
```

```rust
struct AccountWithinBlock {
    account: Account,
    block_hash: Bytes32,
}
```

```rust
struct StorageWithinBlock<N> {
    block_hash: Bytes32,
    account: Account,
    values: [Bytes32; N],
}
```

```rust
struct TxReceiptWithinBlock {
    receipt: TxReceipt,
    block_hash: Bytes32
}
```

```rust
struct TxPartial<MAX_DATA_LEN> {
    nonce: u64,
    gas_limit: u64,
    to: Option<Address>,
    value: U128,
    data: BoundedVec<u8, MAX_DATA_LEN>,
    v: u8,
    r: Bytes32,
    s: Bytes32,
}
```

```rust
struct TransactionWithinBlock<MAX_DATA_LEN> {
    transaction: TxPartial<MAX_DATA_LEN>,
    block_hash: Bytes32
}
```

## RLP decoding

[rlp folder](./src/rlp/README.md) contains tools to work with RLP encoded data
