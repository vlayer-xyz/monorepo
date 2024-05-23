import { Abi } from '@noir-lang/noirc_abi';

export class CircuitAbi {
  constructor(public abi: Abi) {}

  public public(): Abi {
    const parameters = this.abi.parameters.filter((param) => param.visibility === 'public');
    return {
      ...this.abi,
      parameters
    };
  }

  public return(): Abi {
    return {
      parameters: [],
      param_witnesses: {},
      error_types: {},
      return_type: this.abi.return_type,
      return_witnesses: this.abi.return_witnesses
    };
  }
}
