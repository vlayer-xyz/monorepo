# vLayer monorepo

This monorepo contains two sub-projects:
* **noir-ethereum-history-api** - [Noir](https://noir-lang.org) library for proving and verifying historical data on the Ethereum blockchain and other EVM compatible blockchains. It supports proving accounts, storage, logs, receipts & transactions. Checkout it's **[docs](./ethereum_history_api/README.md)** for more details.
* **vLayer** - Contains real life examples of what can be achieved using **noir-ethereum-history-api**. It's a work in progress and lacks documentation.

## Prerequisites

**nargo** and **foundry** must be installed in order to compile and test code in this repository.

- [nargo installation](https://noir-lang.org/docs/getting_started/installation/) `>= 0.29.0`
- [foundry installation](https://book.getfoundry.sh/getting-started/installation)
- [yarn](https://yarnpkg.com) `>= 4.1.0`

## Getting started

### Installing dependencies

Run `yarn` to install dependencies.

### Running checks

To run all static checks (eslint, prettier, typecheck) type:

```sh
yarn check
```

To run checks individually use:

* `yarn lint:all` - to run `eslint` on the whole repo

* `yarn format:all` - to run `prettier` on the whole repo

* `yarn typecheck:all` - to run `typescript` checks on the whole repo

### CI workflows

We use Github actions to run tests on CI. For a detailed description of what does each workflow do consult [Workflow Docs](./.github/workflows/README.md)

## DISCLAIMER

The code in this repo is in active development and subject to breaking changes. Use at your own risk. No responsibility is assumed for any potential issues arising from its use.
