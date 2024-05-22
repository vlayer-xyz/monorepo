# Stages & artifacts of recursive circuit compilation & proving

If one wants to recursively verify big Noir proof inside another Noir proof - they need to prepare a proof in a format that is expected by the [`std::verify_proof`](https://noir-lang.org/docs/noir/standard_library/recursion#verifying-recursive-proofs) function. It's recommended to get yourself familiar with that [docs page](<(https://noir-lang.org/docs/noir/standard_library/recursion#verifying-recursive-proofs)>) before proceeding.

This includes the verification key (later **vk**)

This is trivial in NoirJS. One just calls a method of `bb.js` library `generateRecursiveProofArtifacts(proof, inputs)` which generates `vkHash`, `vkAsFields`, `proofAsFields`.

NoirJS under the hood uses the `WASM` build of Barretenberg which [hits the 4GB memory limit](https://github.com/noir-lang/noir/issues/4481) and breaks when the circuit is `> 2^19` gates `(~500k)`

Our circuits contain a lot of keccaks, so our proofs consist of more than 500k gates. Therefore using NoirJS is not an option and we need to use nargo for proving recursive circuits.

Unfortunately `nargo` does not generate any of the recursion artifacts. Noir team suggested a workaround to use barretenberg (later **bb**) library directly through the CLI. This package allows you to do that.

## Dictionary

- Circuit source code - `ethereum/circuits`
  - the source of truth, all artifacts are generated from it
- Compiled artifact - `target/${name}.json`
  - generated from code using `nargo compile --package ${name}`
  - It's a JSON that contains [`base64`](https://en.wikipedia.org/wiki/Base64) encoded bytecode under the `.bytecode` key
- Acir bytecode
  - generated from **compiled artifact** by taking the bytecode and decoding it as `base64`, as **bb** expects it in plain binary form. We use a temp file for it as it's fast to generate and we only use it during **VK** generation
- VK - `target/${name}.vk.bin`
  - verification key is generated from **acir bytecode** by running:
    - `./bb write_vk -b ${acirPath} -o ${vkPath}`
  - We cache it in a file as it's slow to generate
- VK.json - `target/${name}.vk.json`
  - generated from VK by running:
    - `./bb vk_as_fields  -k ${vkPath} -o ${vkJsonPath}`
  - JSON array that contains `vkHash` as the first element and `vkAsFields` after it

## Usage

```TS
// Read circuit compilation artifact
const circuit = await MonorepoCircuit.create('../../', 'get_header');
// Generate VK - slow.
await generateVk(circuit);
// Read generated VK
const vk = await VerificationKey.create(circuit);
```
