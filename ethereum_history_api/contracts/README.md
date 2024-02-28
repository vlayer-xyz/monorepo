## Noir Ethereum history api Solidity smart contracts

Noir Ethereum history api Solidity smart contracts. It consists of:

- `EthereumHistoryVerifier` which ensures block belongs to the chain
- `UltraVerifier` (auto-generated from [noir circuits](ethereum_history_api/circuits)) with tests

## Usage

Note: all the commands below must be run from `ethereum_history_api/contracts` folder.

### Build

To compile Solidity files, run:

```shell
$ forge build
```

### Test

To test the files, run:

```shell
$ forge test
```

### Anvil

To start anvil run:

```shell
$ anvil
```

### Help

```shell
$ forge --help
$ anvil --help
```
