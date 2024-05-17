import { MonorepoCircuit } from '../noir/circuit/circuit.js';
import { VerificationKey, generateVk } from '../noir/circuit/vk.js';

const circuit = await MonorepoCircuit.create('../../', 'get_storage');
await generateVk(circuit);
const vk = await VerificationKey.create(circuit);
// eslint-disable-next-line no-console
console.log(vk);
