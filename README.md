# noir-ethereum-history-api

noir-ethereum-history-api is an API that lets you prove and verify account/storage states of any block in a blockchain (more about zero-knowledge proofs: [Zero knowledge - Wikipedia](https://en.wikipedia.org/wiki/Zero_knowledge#:~:text=Zero%2Dknowledge%20proof%2C%20a%20concept,the%20veracity%20of%20the%20statement)). It is currently in a development stage.

### Code structure
The code comprises of 3 main libraries:
|           | README in                           | what it does |
|-----------|-------------------------------------|--------------|
| circuits  | `ethereum_history_api/circuits/lib` |              |
| contracts | `ethereum_history_api/contracts`    |              |
| oracles   | `ethereum_history_api/oracles`      |              |

## Prerequisites

You need to have nargo and foundry installed in order to compile and test code in this repository. 

[nargo installation](https://noir-lang.org/docs/getting_started/installation/)

[foundry installation](https://book.getfoundry.sh/getting-started/installation)


## Getting started

Run `yarn` to install dependencies (or if you're using VSCode click _okay_ in the popup window that prompts you to install dependencies)

`yarn lint:all` - to run `eslint` on the whole repo

`yarn format:all` - to run `prettier` on the whole repo

`yarn typecheck:all` - to run `typescript` checks on the whole repo

`yarn check` - to run all static checks (eslint, prettier, typecheck)

### Compilation & testing

You'll find info about compilation and testing of each library (circuits, contracts and oracles) in their corresponding READMEs (see _Code structure_ above).



