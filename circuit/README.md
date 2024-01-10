# Noir Ethereum history API circuit

## Troubleshooting

### Unused expression result of type OracleMock

Just assign it to `_`. This is how they [solve it](https://github.com/noir-lang/noir/blob/5be049eee6c342649462282ee04f6411e6ea392c/test_programs/execution_success/brillig_oracle/src/main.nr#L17C5-L17C13) in the Noir repo also

```rust
let _ = OracleMock::mock(...)
```

