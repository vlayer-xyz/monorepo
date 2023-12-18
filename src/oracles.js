import initNoirAbi, { abiEncode, abiDecode, WitnessMap, Field } from '@noir-lang/noirc_abi';
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

function argToBigIng(arg) {
  return parseInt(arg[0], 16)
}

const getAccount = async (blockNo, address) => {
  const result = [
    (18800000n).toString(16),
    (0n).toString(16)
  ]
  return Promise.resolve(result)
}

export const oracles = async (name, args) => {
  if (name === "get_account") {
    return await getAccount(...args);
  }
  return Promise.reject("Unknown oracle");
}
