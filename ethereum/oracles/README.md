# Noir Ethereum history api oracles

TypeScript oracle server that provides data for circuits.

There are five oracles:

- **Header** Oracle - fetches Ethereum block header
- **Account** Oracle - fetches Ethereum account state with state proof
- **Proof** Oracle - fetches Ethereum storage value with both storage & state proof
- **Receipt** Oracle - fetches Ethereum receipt with receipt proof
- **Transaction** Oracle - fetches Ethereum transaction with transaction proof

Below are headers for respective functions in Noir:

```rust
fn get_header_oracle(chain_id: Field, block_no: Field) -> (BlockHeaderPartial, BlockHeaderRlp);
fn get_account_oracle(chain_id: Field, block_no: Field, address: Address) -> AccountWithStateProof;
fn get_proof_oracle(chain_id: Field, block_no: Field, address: Address, storage_key: Bytes32) -> StateAndStorageProof;
fn get_receipt_oracle(chain_id: Field, block_no: Field, tx_idx: Field) -> (TxType, TxReceipt, TxReceiptProof);
fn get_transaction_oracle(chain_id: Field, block_number: u64, tx_idx: Field) -> (TxType, Transaction, TransactionProof);

```

## Starting oracle server

To run Oracle server, you'll need RPC access to an ETH node.
Set it as an environment variable in `.env` file.
`ETHEREUM_JSON_RPC_API_URL=<url>`
You can copy `.env.example` file.

To start oracle server run:

```sh
yarn oracle-server
```

or in watch mode:

```sh
yarn oracle-server:watch
```

This will start the server listening at `http://127.0.0.1:5555`.

You can pass this URL to `nargo` commands using `--oracle-resolver=http://127.0.0.1:5555` flag.

## Testing

To run unit & integration tests:

```sh
yarn test:unit
```

or with coverage report:

```sh
yarn test:unit:coverage
```

### Fixtures

Fixtures are saved data from `JSON RPC` node to be used in tests. They allow our tests to run offline and be deterministic. There are two formats to which fixtures are generated: `Noir` and `JS`.

To generate fixtures run:

```sh
yarn prepare-fixtures
```

This prepares both `JS` and `Noir` fixtures

#### JavaScript Fixtures

`JavaScript` fixtures are JSON files which cache JSON RPC request/responses pairs.
`JavaScript` fixtures are consumed either directly in unit tests or through a `Mock client` in integration tests.

To generate `JS` fixtures:

```sh
yarn prepare-js-fixtures
```

Files will be generated in `ethereum/oracles/fixtures`.

#### Noir Fixtures

Noir fixtures are generated as Noir modules (i.e. `.nr` files) and consumed in `Noir` tests.

To generate `Noir` fixtures:

```sh
yarn prepare-noir-fixtures
```

Files will be generated in `ethereum/circuits/lib/src/fixtures`.

#### Configuration of Fixtures

Fixture represents an interesting system state that will be tested.

Examples of fixtures:

- Crypto punk account state at london block
- USDC Circle balance as paris block

Fixture config is located at [`config.ts`](src/fixtures/config.ts) file. To add a certain Account enter `block number` and `account address`. To additionally add Storage slots from that account enter chosen `storage keys`. New configuration data needs to adhere to the format below:

```
interface Fixture {
  blockNumber: bigint;
  address?: Address;
  storageKeys?: Hex[];
}
```

Note: both `address` & `storageKeys` fields are optional.
