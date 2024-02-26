# noir-ethereum-history-api

_noir-ethereum-history-api_ is a [Noir](https://noir-lang.org) library for proving and verifying account balances and smart contracts storage slots on the Ethereum blockchain and other EVMs. 

As for now, it allows for proving and verifying last 256 blocks.

It is currently in a development stage.

### Repository structure
This monorepo consists of four sub-projects:
* [Circuits](ethereum_history_api/circuits/lib/) - Noir circuits to generate account and storage proofs for historical blocks data
* [Contracts](ethereum_history_api/contracts/) - related Solidity contracts with tests
* [Oracles](ethereum_history_api/oracles/) - TypeScript oracle server that provides data for circuits
* [Tests](ethereum_history_api/tests/) - e2e tests in TypeScript

## Prerequisites

_nargo_ and _foundry_ must be installed in order to compile and test code in this repository. 

* [nargo installation](https://noir-lang.org/docs/getting_started/installation/)
* [foundry installation](https://book.getfoundry.sh/getting-started/installation)
* [yarn](https://yarnpkg.com) >= 4.1.0


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
* [Circuits](ethereum_history_api/circuits/lib/README.md#compilation)
* [Contracts](ethereum_history_api/contracts/README.md#build) 
* [Oracles](ethereum_history_api/oracles/README.md)
* [Tests](ethereum_history_api/tests/README.md)


