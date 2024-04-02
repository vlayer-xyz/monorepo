# trie-proofs

This package contains methods for Ethereum merkle trie proofs verification and RLP decoding.

### RLP decoding interface

- `fn decode0<N>(input: [u8; N]) -> (Field, Field)` takes an RLP-encoded string as input and returns the offset of the byte string and its length.
- `fn decode1<N, NUM_FIELDS>(input: [u8; N]) -> RLP_List<NUM_FIELDS>` takes an RLP-encoded list as input and returns a decoded RLP list struct (see `lib/src/rlp.nr` for more). Note that a type annotation is required when invoking `decode1`, e.g.
```rust
	let decoded_bytes: RLP_List<NUM_FIELDS> = decode1(input);
```
- `fn decode1_small_lis<N, NUM_FIELDS>(input: [u8; N]) -> RLP_List<NUM_FIELDS>` is the same as `decode1` except it assumes that the list elements are strings of length less than 56 bytes. This is sufficient e.g. in the case of storage trie nodes or non-terminal state trie nodes and is provided for gate count optimisation purposes.

### Trie proof verification interface

- `fn verify_storage_root(self: TrieProof<32, PROOF_LEN, MAX_VALUE_LEN>, storage_root: [u8; HASH_LENGTH]) -> bool`  takes a storage proof (`self`) and storage root (`storage_root`) as inputs and returns `true` if the proof is successfully verified.
- `fn verify_state_root(self: TrieProof<20, PROOF_LEN, MAX_VALUE_LEN>, state_root: [u8; HASH_LENGTH]) -> bool` takes a state proof (`self`) and state root (`state_root`) as inputs and returns `true` if the proof is successfully verified.
- `fn verify_receipt_root(self: TrieProof<3, PROOF_LEN, RECEIPT_RLP_LEN>, receipt_root: [u8; HASH_LENGTH]) -> bool` takes a receipt proof (`self`) and receipt root (`receipt root`) as inputs and returns `true` if the proof is successfully verified.
- `fn verify_transaction_root(self: TrieProof<3, PROOF_LEN, TX_RLP_LEN>, transaction_root: [u8; HASH_LENGTH]) -> bool` takes a transaction proof (`self`) and transaction root (`receipt root`) as inputs and returns `true` if the proof is successfully verified.


## Consuming this library

With Nargo v0.10.4, you can depend on this library by adding the following to your `Nargo.toml`:

```toml
[dependencies]
noir_trie_proofs = { git = "aragonzkresearch/noir-trie-proofs", tag = "main", directory = "lib" }
```