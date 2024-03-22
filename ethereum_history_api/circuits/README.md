# Noir Ethereum history api circuits

Noir circuits for proving and verifying historical data on the Ethereum blockchain and other EVMs.

## Monorepo structure

| Package                         | Description                                 | Docs                            |
| ------------------------------- | ------------------------------------------- | ------------------------------- |
| [`lib`](./lib/)                 | Main library containing oracles & verifiers | [Docs](./lib/README.md)         |
| [`get_header`](./get_header/)   | Binary crate for generating header proofs   | [Docs](./get_header/README.md)  |
| [`get_account`](./get_header/)  | Binary crate for generating account proofs  | [Docs](./get_account/README.md) |
| [`get_storage`](./get_storage/) | Binary crate for generating storage proofs  | [Docs](./get_storage/README.md) |
| [`get_receipt`](./get_receipt/) | Binary crate for generating receipt proofs  | [Docs](./get_receipt/README.md) |

## Compile

```sh
nargo compile --workspace
```

or a single package:

```sh
nargo compile --package ${package_name}
```

Compiled artifacts will be placed in [target](../../target/) folder.

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

Generated verifiers will be placed in [`contract/${package_name}/plonk_vk.sol`](../../contract/) folder.

Each one will have a `verify(bytes proof, bytes32[] publicInputs) (bool)` function that can be used to verify proofs.

## Generate proofs

### Prerequisites

We use oracles and therefore you need to run the `Oracle server` before generating proofs.
Please consult [Oracle server](../oracles/README.md#starting-oracle-server) docs on how to start it or [noir docs](https://noir-lang.org/docs/how_to/how-to-oracles/#step-3---usage-with-nargo) for detailed docs on oracle usage.

```sh
nargo prove --package ${package_name} --oracle-resolver http://localhost:5555
```

Generated proofs will be placed in [proofs](../../proofs/) folder.
