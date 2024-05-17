import { randomUUID } from 'crypto';
import { MonorepoCircuit } from './circuit.js';
import { NargoProver } from './nargoProver.js';
import { encodeProofAsFields, encodePublicInputs } from './utils.js';
import { InputMap } from '@noir-lang/noirc_abi';
import { Hex } from 'viem';

export class BaseProver {
  constructor(public circuit: MonorepoCircuit) {}
  public async proveBase(inputs: InputMap): Promise<Hex[]> {
    const proofId = randomUUID();
    const prover = new NargoProver(this.circuit, proofId);

    const { proof, verifierData } = await prover.prove(inputs);

    return await encodeProofAsFields(
      proof,
      encodePublicInputs(this.circuit.artefact.abi, verifierData),
      this.circuit.vkPath(),
      prover.proofAsFieldsPath()
    );
  }
}
