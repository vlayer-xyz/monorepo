import { createDefaultClient } from '../ethereum/client.js';
import { writeFile } from 'fs/promises';
import { stringify } from '../utils/json-bigint.js';

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

const client = createDefaultClient();
console.log('Downloading blocks...');

const result = [];
for (const blockNumber of blocks) {
  console.log(blockNumber);
  const block = await client.getBlock({ blockNumber });
  result.push(block);
}

await writeFile(filePath, stringify(result));
console.log(`File has been saved: ${filePath}`);
