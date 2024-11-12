# Ethereum

This project contains a library that allows you to prove:

- Account state
  - `balance`, `nonce`, `codeHash`, `storageRoot`
  - Example: _`Vitalik's` balance was `5 ETH` at block `N`_
- Storage values by key
  - Example: _`Uniswap` contract had value `5` at storage slot `0` at block `N`_
- Transaction inclusion
  - Example: _Transaction number `115` in block `N` was sending `3 ETH` to address `to`_
- Receipt inclusion
  - Example: _Transaction number `115` in block `N` succeeded (`status == 1`) and used `100k` gas_
- Log inclusion
  - Example: _Log number `0` within transaction number `115` in block `N` has `topic0 === 0x...`_

Codebase also includes support for base Ethereum structures in Noir:

- Decoding RLP format
- Ethereum Merkle Patricia Tries proofs
- Mappings of Basic Ethereum data types: uint256, address, bytes32, hash
- Fragment data structure, similar to Rust's slice, used for parsing data

Additionally, we provide [smart contracts](./contracts/src/EthereumHistoryVerifier.sol) that allow to verify inclusion of block in the chain for last 256 blocks.

## Repository structure

This monorepo consists of the following sub-projects:

| Package                       | Description                                                                     | Docs                             |
| ----------------------------- | ------------------------------------------------------------------------------- | -------------------------------- |
| [`Circuits`](./circuits/lib/) | Noir circuits to generate account and storage proofs for historical blocks data | [Docs](./circuits/lib/README.md) |
| [`Contracts`](./contracts/)   | Related Solidity contracts with tests                                           | [Docs](./contracts/README.md)    |
| [`Oracles`](./oracles/)       | TypeScript oracle server that provides data for circuits                        | [Docs](./oracles/README.md)      |
| [`Tests`](./tests/)           | E2E tests in TypeScript                                                         | [Docs](./tests/README.md)        |

### Compilation & testing

Compilation and testing instructions for individual projects:

- [Circuits](./circuits/lib/README.md#compilation)
- [Contracts](./contracts/README.md#build)
- [Oracles](./oracles/README.md#testing)
- [Tests](./tests/README.md#running-e2e-tests)
