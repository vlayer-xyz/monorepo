import { randomUUID } from 'crypto';
import { MonorepoCircuit } from './circuit.js';
import { NargoProver } from './nargoProver.js';
import { encodeProofAsFields } from './utils.js';
import { InputMap } from '@noir-lang/noirc_abi';
import { Hex } from 'viem';
import path from 'path';
import { VerifierData } from './verifierData.js';

export interface VerifiableComputation {
  proofAsFields: Hex[];
  verifierData: VerifierData;
}

export class BaseProver {
  constructor(public circuit: MonorepoCircuit) {}
  public async proveBase(inputs: InputMap): Promise<VerifiableComputation> {
    const proofId = randomUUID();
    const prover = new NargoProver(this.circuit, proofId);

    const proof = await prover.prove(inputs);

    const proofAsFieldsPath = path.join(this.circuit.root, 'proofs', `${this.circuit.name}.proof.json`);
    const verifierData = await VerifierData.create(prover.verifierTomlPath, this.circuit.artefact.abi);
    const proofAsFields = await encodeProofAsFields(
      proof,
      verifierData.publicInputs(),
      this.circuit.vkPath(),
      proofAsFieldsPath
    );
    return { proofAsFields, verifierData };
  }
}
