# Noir Ethereum history api e2e tests

E2e tests in TypeScript.

Before running tests start oracle server

```sh
cd ethereum_history_api/oracles
yarn oracle-server
```

and run e2e prep script:

```sh
../scripts/e2e_prep.sh
```

To run tests run:

```sh
cd ethereum_history_api/tests
yarn test:e2e
```
