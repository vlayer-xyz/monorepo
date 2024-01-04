import { createDefaultClient } from '../ethereum/client.js';
import { writeFile } from 'fs'
import { stringify } from 'json-bigint';
import { Hex } from "viem";

const filePath = './result.json';

interface GetProofParams {
  address: Hex,
  blockNumber: bigint
}

const getProofParams: GetProofParams = {
  address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
  blockNumber: 14194126n
}

const client = createDefaultClient();
console.log(`Downloading proof...`);

const proof = await client.getProof({
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
