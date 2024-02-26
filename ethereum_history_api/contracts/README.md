## Noir Ethereum history api Solidity smart contracts

Solidity verifier contracts with tests.

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

### Format

To format the files, run:
```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

To start anvil run:
```shell
$ anvil
```

### Deploy

```shell
$ forge script script/EthereumHistoryVerifier.s.sol:EthereumHistoryVerifierScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
