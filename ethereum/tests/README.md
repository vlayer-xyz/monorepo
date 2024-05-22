# Noir Ethereum history api e2e tests

This package ties together all the pieces. It takes proofs, input data, verifier contracts and checks that verifier contracts can in fact accept valid proofs and reject invalid proofs.

## Prerequisites

### Oracle server

Before running tests start oracle server in a separate terminal.
Make sure JSON-RPC is configured in your `.env` ([details](https://github.com/vlayer-xyz/noir-ethereum-history-api/blob/main/ethereum/oracles/README.md#starting-oracle-server))

```sh
(cd ../oracles && yarn oracle-server)
```

### Generating proofs & verifier contracts

```sh
(cd ../scripts && ./e2e_prep.sh)
```

This takes a couple of minutes as it generates proofs for all packages

### Compiling verifier contracts

```sh
(cd ../contracts && forge compile)
```

## Running e2e tests

```sh
yarn test:e2e
```

Under the hood it will:

- run `anvil` development node
- deploy verifier contracts
- call `verify(proof, inputData)`
