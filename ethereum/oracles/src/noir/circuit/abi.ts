import { Abi } from '@noir-lang/noirc_abi';

export function publicInputs(abi: Abi): Abi {
  const parameters = abi.parameters.filter((param) => param.visibility === 'public');
  return {
    ...abi,
    parameters
  };
}

export function returnValues(abi: Abi): Abi {
  return {
    parameters: [],
    error_types: {},
    return_type: abi.return_type,
  };
}
