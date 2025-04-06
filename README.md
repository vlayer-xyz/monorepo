# vLayer Monorepo

This monorepo contains two sub-projects:

- **ethereum** - [Noir](https://noir-lang.org) library for proving and verifying historical data on the Ethereum blockchain and other EVM compatible blockchains. It supports proving accounts, storage, logs, receipts & transactions. **[Read more](./ethereum/README.md)**.

- **vlayer** - Contains vLayer SDK along with real-life examples. The SDK provides tools for zero-knowledge proofs of blockchain data. **[See examples](./vlayer/examples)**.

## Project Structure

```
vlayer-monorepo/
├── ethereum/         # Noir circuits and smart contracts
│   ├── circuits/     # Zero-knowledge circuits
│   ├── contracts/    # Solidity contracts
│   ├── oracles/      # Blockchain data providers
│   └── tests/        # Test suite
├── vlayer/           # vLayer SDK
│   ├── ethereum/     # Ethereum-specific implementations
│   └── examples/     # Example applications
```

## Prerequisites

**nargo** and **foundry** must be installed in order to compile and test code in this repository.

- [nargo installation](https://noir-lang.org/docs/getting_started/installation/) `>= 0.30.0`
- [foundry installation](https://book.getfoundry.sh/getting-started/installation)
- [yarn](https://yarnpkg.com) `>= 4.1.0`

## Getting Started

### Installing Dependencies

Run `yarn` to install dependencies.

### Running Checks

To run all static checks (eslint, prettier, typecheck) type:

```sh
yarn check
```

To run checks individually use:

- `yarn lint:all` - to run `eslint` on the whole repo

- `yarn format:all` - to run `prettier` on the whole repo

- `yarn typecheck:all` - to run `typescript` checks on the whole repo

### Building the Project

```sh
yarn build
```

### CI Workflows

We use Github Actions to run tests on CI. For a detailed description of what each workflow does, consult [Workflow Docs](./.github/workflows/README.md).

## Contributing

We welcome contributions to vLayer! Please feel free to submit a PR or open an issue.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## DISCLAIMER

The code in this repo is in active development and subject to breaking changes. Use at your own risk. No responsibility is assumed for any potential issues arising from its use.
