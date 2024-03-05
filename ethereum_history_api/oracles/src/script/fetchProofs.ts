import { createDefaultClient } from '../ethereum/client.js';
import { writeFile, appendFile } from 'fs/promises';
import { stringify } from '../util/json-bigint.js';
import { type GetProofParameters, type GetProofReturnType } from 'viem';
import { CIRCLE_USDC_BALANCE_STORAGE_KEY } from '../fixtures/config.js';

const filePath = './fixtures/eth_getProof_response.json';
const filePathStorage = './fixtures/eth_getProofWithStorage_response.json';

const getProofParams: GetProofParameters = {
  address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
  storageKeys: [],
  blockNumber: 14194126n
};

const getProofWithStorageParams: GetProofParameters = {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  storageKeys: [CIRCLE_USDC_BALANCE_STORAGE_KEY],
  blockNumber: 19_000_000n
};

const client = createDefaultClient();

console.log('Downloading proofs...');
const proof: GetProofReturnType = await client.getProof(getProofParams);
const proofWithStorage: GetProofReturnType = await client.getProof(getProofWithStorageParams);

const indent = '  ';

await writeFile(filePath, stringify(proof, null, indent));
await appendFile(filePath, '\n');
console.log(`File has been saved: ${filePath}`);

await writeFile(filePathStorage, stringify(proofWithStorage, null, indent));
await appendFile(filePathStorage, '\n');
console.log(`File has been saved: ${filePathStorage}`);
