import { createDefaultClient } from '../ethereum/client.js';
import { writeFile } from 'fs'
import { stringify } from 'json-bigint';
import { GetProofParameters, GetProofReturnType } from "viem";

const filePath = './result.json';

const getProofParams: GetProofParameters = {
  address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
  storageKeys: [],
  blockNumber: 14194126n
}

const client = createDefaultClient();
console.log(`Downloading proof...`);

const proof: GetProofReturnType = await client.getProof({
  address: getProofParams.address,
  storageKeys: [],
  blockNumber: getProofParams.blockNumber
});

writeFile(filePath, stringify(proof), (err) => {
  if (err) {
    console.error('An error occurred:', err);
    return;
  }
  console.log(`File has been saved: ${filePath}`);
});
