import { mainnet } from 'viem/chains';
import { MonorepoCircuit } from '../noir/circuit/circuit.js';
import { GetStorageProver } from '../noir/circuit/provers/getStorage.js';
import { HISTORY_API_FIXTURES } from '../fixtures/historyAPIConfig.js';

const { blockNumber, address, storageKeys } = HISTORY_API_FIXTURES.mainnet.paris.usdc_circle;

const circuit = await MonorepoCircuit.create('../../', 'get_storage');
const getStorageProver = new GetStorageProver(circuit);
const { proofAsFields } = await getStorageProver.prove(mainnet.id, blockNumber, address!, storageKeys![0]);
// eslint-disable-next-line no-console
console.log(proofAsFields);
