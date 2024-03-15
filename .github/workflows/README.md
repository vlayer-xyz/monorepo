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
- [Static checks](./static_checks.yaml)
  - Runs `yarn format:all:ci`
  - Runs `yarn lint:all`
  - Runs `yarn prepare-js-fixtures`
  - Runs `yarn prepare-noir-fixtures`
