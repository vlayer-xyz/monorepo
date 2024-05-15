# Stages & artifacts of recursive circuit compilation & proving

If one wants to recursively verify big Noir proof inside another Noir proof - they need to prepare a proof in a format that is expected by the [`std::verify_proof`](https://noir-lang.org/docs/noir/standard_library/recursion#verifying-recursive-proofs) function.

This includes the verification key (later **vk**)

This is trivial in NoirJS. One just calls `backend.generateRecursiveProofArtifacts()` which generates `vkHash`, `vkAsFields`, `proofAsFields`.

Unfortunately `nargo` does not generate any of those. Noir team suggested a workaround to use barretenberg (later **bb**) library directly through the CLI. This package allows you to do that.

## Dictionary

- Circuit source code - `ethereum_history_api/circuits`
  - is the source of truth all artifacts are generated from it
- Compiled artifact - `target/${name}.json`
  - generated from code using `nargo compile --package ${name}`
- Acir bytecode
  - is generated from compiled artifact by taking the bytecode and decoding it as `base64` as `bb` expects it in plain binary form. We use a temp file for it as it's fast to generate and we only use it during vk generation
- VK - `target/${name}.vk.bin`
  - verification key is generated from `acir bytecode` by running `bb write_vk`. We cache it in a file as it's slow to generate
- VK.json - `target/${name}.vk.json`
  - is generated from VK by running `bb vk_as_fields`
  - It's a JSON array that contains `vkHash` as the first element and `vkAsFields` after it

## Usage

```TS
// Read circuit compilation artifact
const circuit = await MonorepoCircuit.create('../../', 'get_header');
// Generate VK - slow.
await generateVk(circuit);
// Read generated VK into memory
const vk = await VerificationKey.create(circuit);
```
