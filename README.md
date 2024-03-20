# noir-ethereum-history-api

**noir-ethereum-history-api** is a [Noir](https://noir-lang.org) library for proving and verifying historical data on the Ethereum blockchain and other EVMs.

It allows you to prove:

- Account state
  - `balance`, `nonce`, `codeHash`, `storageRoot`
  - Exmaple: _`Vitalik's` balance was `5 ETH` at block `N`_
- Storage values by key
  - Example: _`Uniswap` contract had value `5` at storage slot `0` at block `N`_
- Transaction inclusion
  - Example: _Transaction number `115` in block `N` was sending `3 ETH` to address `to`_
- Receipt inclusion
  - Example: _Transaction number `115` in block `N` succeeded (`status == 1`) and used `100k` gas_
- Log inclusion
  - Example: _Log number `0` within transaction number `115` in block `N` has `topic0 === 0x...`_

As for now, it allows for proving and verifying last 256 blocks.

It is currently in a development stage.

### Repository structure

This monorepo consists of the following sub-projects:

| Package                                          | Description                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| [`Circuits`](ethereum_history_api/circuits/lib/) | Noir circuits to generate account and storage proofs for historical blocks data |
| [`Contracts`](ethereum_history_api/contracts/)   | Related Solidity contracts with tests                                           |
| [`Oracles`](ethereum_history_api/oracles/)       | TypeScript oracle server that provides data for circuits                        |
| [`Tests`](ethereum_history_api/tests/)           | E2E tests in TypeScript                                                         |

## Prerequisites

**nargo** and **foundry** must be installed in order to compile and test code in this repository.

- [nargo installation](https://noir-lang.org/docs/getting_started/installation/)
- [foundry installation](https://book.getfoundry.sh/getting-started/installation)
- [yarn](https://yarnpkg.com) >= 4.1.0

## Getting started

### Installing depdendencies

Run `yarn` to install dependencies.

### Running checks

To run all static checks (eslint, prettier, typecheck) type:

```sh
yarn check
```

To run checks individually use:

`yarn lint:all` - to run `eslint` on the whole repo

`yarn format:all` - to run `prettier` on the whole repo

`yarn typecheck:all` - to run `typescript` checks on the whole repo

### Compilation & testing

Compilation and testing instructions for individual projects:

- [Circuits](ethereum_history_api/circuits/lib/README.md#compilation)
- [Contracts](ethereum_history_api/contracts/README.md#build)
- [Oracles](ethereum_history_api/oracles/README.md)
- [Tests](ethereum_history_api/tests/README.md)

### CI workflows

We use Github actions to run tests on CI. For a detailed description of what does each workflow do consult [Workflow Docs](./.github/workflows/README.md)
