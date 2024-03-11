# Noir Ethereum history api oracles

TypeScript oracle server that provides data for circuits.

There are three oracles:

- Header Oracle - gets only one argument that is block number
- Account Oracle - gets two arguments: block number and account address
- Proof Oracle - gets three arguments: block number, account address and storage key

Below are headers for respective functions in Noir:

```rust
fn get_header(block_no: Field) -> (BlockHeaderPartial, BlockHeaderRlp);
fn get_account(block_no: Field, address: Address) -> AccountWithStateProof;
fn get_proof(block_no: Field, address: Address, storage_key: Bytes32) -> StateAndStorageProof;
```

## Starting oracle server

Oracle server uses connection to Ethereum node. Hence, before running oracle server, first create a `.env` file with a url to Ethereum node. Use template `.env.example` and replace `ETHEREUM_JSON_RPC_API_URL` with your url to rpc server, then the file should be saved as `.env`.

To start oracle server run:

```sh
yarn oracle-server
```

Following command allows you to use server without restarting it after every change. Server automatically uses new configuration after file change is saved.

```sh
yarn oracle-server watch
```

## Testing

To test oracles run:

```sh
yarn test:unit
```

To be able to additionally see the coverage of tests, run:

```sh
yarn test:unit:coverage
```

After running these commands unit tests, but also integration tests of oracles are run.

### Fixtures

A few projects in this monorepo use fixtures for testing. Fixtures are precached data from JSON RPC node, saved for later use. There are two formats to which fixtures are generated: Noir and js. Both described below.

#### Noir Fixtures

Noir fixtures are generated as Noir modules (i.e. `.nr` files) and consumed in Noir tests.

To generate data for Noir tests run:

```sh
yarn prepare-noir-fixtures
```

Files will be generated in `ethereum_history_api/circuits/lib/src/fixtures`.

#### JavaScript Fixtures

JavaScript fixtures are JSON files which cache JSON RPC request/responses pairs.
JavaScript fixtures are consumed either directly in unit tests or through a Mock client in integration tests.

To generate data for JavaScript tests run:

```sh
yarn prepare-js-fixtures
```

Files will be generated in `ethereum_history_api/oracles/fixtures`.

#### Configuration of Fixtures

Fixture represents an interesting system state that will be tested.

Examples of fixtures:

- Crypto punk account state at london block
- USDC Circle balance as paris block

To configure the data that will be prepared, manipulate `oracles/src/fixtures/config.ts` file. To add a certain Account enter block number and account address. To additionally add Storage slots from that account enter chosen storage keys. New configuration data needs to adhere to the format below:

```
interface Fixture {
  blockNumber: bigint;
  address: Address;
  storageKeys?: Hex[];
}
```

Note: storageKeys field can be omitted if generating storage slots is not expected.
