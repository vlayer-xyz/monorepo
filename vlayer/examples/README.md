# vlayer SDK Examples

This directory contains practical examples demonstrating how to use the vlayer SDK to create zero-knowledge proofs for Ethereum blockchain data verification.

## Overview

vlayer enables developers to prove and verify historical data on Ethereum and other EVM-compatible blockchains using zero-knowledge proofs. These examples showcase real-world use cases including NFT ownership verification and token balance proofs.

## Available Examples

### NFT Ownership Proofs

- **[is_ape_owner](./circuits/is_ape_owner/)** - Prove ownership of a Bored Ape Yacht Club NFT without revealing your wallet address or token ID
- **[is_crypto_punk_owner](./circuits/is_crypto_punk_owner/)** - Prove ownership of a CryptoPunk NFT privately

### Token Balance Proofs

- **[is_dao_worthy](./circuits/is_dao_worthy/)** - Prove you hold at least $100k USDC for DAO eligibility without revealing exact balance
- **[is_dao_worthy_recursive](./circuits/is_dao_worthy_recursive/)** - Same as above but using recursive proof composition for better efficiency

## Prerequisites

Before running these examples, ensure you have the following installed:

### Required Tools

- **nargo** (>= 0.30.0) - Noir compiler and package manager
- **foundry** - Ethereum development toolchain
- **yarn** (>= 4.1.0) - Package manager

## Learn More

- vlayer Documentation: https://docs.vlayer.xyz
- Noir Documentation: https://noir-lang.org/docs
- vlayer Monorepo Root: ../../README.md

## License

See LICENSE in the monorepo root.
