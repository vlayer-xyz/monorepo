# Workflows

- [Circuits profiling](./circuits_profile.yml)
  - Runs `nargo info` and stores the results into an artefact
- [Circuits tests](./circuits_test.yml)
  - Runs `nargo test`
- [Circuits E2E tests](./circuits_e2e.yml)
  - Runs `nargo prove` & `nargo verify`
- [Solidity tests](./contract_test.yml)
  - Runs `forge test`
- [TypeScript E2E tests using solidity verifiers](./e2e_test.yml)
  - Runs `yarn test:e2e`
