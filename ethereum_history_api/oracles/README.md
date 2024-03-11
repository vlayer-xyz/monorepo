## Noir Ethereum history api oracles

TypeScript oracle server that provides data for circuits.

### Preparing fixtures

Fixtures are data used for testing. They are downloaded and kept as local data. There are two types of fixtures: noir and js. They are pepared in different format and are used in different tests.

To generate data for noir tests run:

```sh
yarn prepare-noir-fixtures
```

This command will delete current `circuits/lib/src/fixtures` catalog and it will create a new one with new data prepared inside it. Data will be prepared in noir format.

To generate data for js tests run:

```sh
yarn prepare-js-fixtures
```

To configure what data shoud be prepared, use `oracles/src/fixtures/config.ts`. To find a certain Account enter block number and account address. To select Storage from that account additionaly enter storage key. It should be written in the format as shown below:

```
name_of_account: {
    blockNumber : number_of_block,
    address : address_of_account,
    storageKeys : [storage_keys]
}
```
