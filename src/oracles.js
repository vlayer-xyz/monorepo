import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const getAccount = async (args) => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  })
  const blockNumber = await client.getBlockNumber()
  return Promise.resolve([(18800000n).toString(16)])
}

export const oracles = async (name, args) => {
  if (name === "get_account") {
    return await getAccount(args);
  }
  return Promise.reject("Unknown oracle");
}
