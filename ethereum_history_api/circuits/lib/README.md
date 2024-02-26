# Noir Ethereum history api circuits

Noir circuits to generate account and storage proofs for historical blocks.

## Compilation

To compile circuit files and install dependencies run:

```sh
nargo compile --workspace
```

To compile a single package run:
```sh
nargo compile --package package_name
``` 

## Generating proofs

This circuit uses oracles and therefore you need to run the oracle server before generating proofs.
Oracle server is located in [packages/noir-ethereum-api](../packages/noir-ethereum-api) and can be run by:

```sh
yarn oracle-server
```

Then, to generate proofs, run:

```sh
nargo prove --oracle-resolver http://localhost:5555
```

More details on Noir Ethereum history api oracles in [project directory](ethereum_history_api/oracles/) and oracle feature in [noir docs](https://noir-lang.org/docs/how_to/how-to-oracles/#step-3---usage-with-nargo).

## Generating verifiers

To generate a Solidity verifier for a package run:

```sh
nargo codegen-verifier --package package_name
``` 

For example, for `get_account` package run:
```sh
nargo codegen-verifier --package get_account
```

Note: When run for the first time this step may take several minutes. Also, it is not recommended to use VSCode terminal for this command as it seems to run slowly.

After generating a verifier (`contract/package_name/plonk_vk.sol`) its `verify` function can be used to verify proofs.

## Testing

To test Noir circuit files run:

```sh
nargo test
```
