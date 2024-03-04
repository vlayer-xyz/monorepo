import { createDefaultClient } from '../ethereum/client.js';
import { writeFile } from 'fs/promises';
import { stringify } from '../util/json-bigint.js';
import { CIRCLE_USDC_BALANCE_STORAGE_KEY } from './prepareNoirFixtures.js';
import { type GetProofParameters, type GetProofReturnType } from 'viem';

const filePath = './fixtures/eth_getProofWithStorage_response.json';

const getProofParams: GetProofParameters = {
  address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
  storageKeys: [CIRCLE_USDC_BALANCE_STORAGE_KEY],
  blockNumber: 14194126n
};

const client = createDefaultClient();
console.log('Downloading proof...');

const proof: GetProofReturnType = await client.getProof({
  address: getProofParams.address,
  storageKeys: getProofParams.storageKeys,
  blockNumber: getProofParams.blockNumber
});

await writeFile(filePath, stringify(proof));
console.log(`File has been saved: ${filePath}`);
