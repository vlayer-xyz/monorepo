import { Abi } from '@noir-lang/noirc_abi';

export function filterPublic(abi: Abi): Abi {
  const parameters = abi.parameters.filter((param) => param.visibility === 'public');
  return {
    ...abi,
    parameters
  };
}
