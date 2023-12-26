import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { writeFile } from 'fs'
import { stringify } from 'json-bigint';


const filePath = './result.json';
const blocks = [
  1n,
  1000n,
  100000n,
  1000000n,
  10000000n,
  11000000n,
  12000000n,
  13000000n,
  14000000n,
  15000000n,
  16000000n,
  17000000n,
  18869415n
];

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
})

console.log(`Downloading blocks...`);

const result = [];
for (let blockNumber of blocks) {
  console.log(blockNumber);
  const block = await client.getBlock({ blockNumber });
  result.push(block);
}


writeFile(filePath, stringify(result), (err) => {
  if (err) {
      console.error('An error occurred:', err);
      return;
  }
  console.log(`File has been saved: ${filePath}`);
});

