# Noir get_storage binary circuit

This is a binary Noir crate used to generate storage proofs.

```rust
fn main(block_number: pub Field, address: pub Address, storage_key: pub Bytes32) -> pub StorageWithinBlock<1>
```

Prover data is located in [`Prover.toml`](Prover.toml)
