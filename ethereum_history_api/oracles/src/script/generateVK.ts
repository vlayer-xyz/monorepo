import { MonorepoCircuit } from '../noir/circuit/circuit.js';
import { VerificationKey, generateVk } from '../noir/circuit/vk.js';

const circuit = await MonorepoCircuit.create('../../', 'get_storage');
await generateVk(circuit.artefact.bytecode, circuit.vkPath(), circuit.vkAsFieldsPath());
const vk = await VerificationKey.create(circuit.vkAsFieldsPath());
// eslint-disable-next-line no-console
console.log(vk);
