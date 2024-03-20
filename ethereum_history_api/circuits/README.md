# Noir Ethereum history api circuits

Noir circuits for proving and verifying historical data on the Ethereum blockchain and other EVMs.

## Monorepo structure

| Package                         | Description                                 |
| ------------------------------- | ------------------------------------------- |
| [`lib`](./lib/)                 | Main library containing oracles & verifiers |
| [`get_header`](./get_header/)   | Binary crate for generating header proofs   |
| [`get_account`](./get_header/)  | Binary crate for generating account proofs  |
| [`get_storage`](./get_storage/) | Binary crate for generating storage proofs  |

## Compile

```sh
nargo compile --workspace
```

or a single package:

```sh
nargo compile --package ${package_name}
```

## Test

```sh
nargo test
```

Note: _New `nargo` runs tests in parallel and prints the whole test output at the end, so it's expected to not see any output for the first couple of seconds._

## Profile

```sh
nargo info --workspace
```

or a single package:

```sh
nargo info --package ${package_name}
```

## Generate Solidity verifiers

```sh
nargo codegen-verifier --workspace
```

or a single package:

```sh
nargo codegen-verifier --package ${package_name}
```

Note: _This step may take up to several minutes._

Generated verifier will be placed in `contract/${package_name}/plonk_vk.sol`.

It's `verify(bytes proof, bytes32[] publicInputs) (bool)` function can be used to verify proofs.

## Generate proofs

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
