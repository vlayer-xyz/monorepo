import { toBytes } from '../encoding/toBytes.js';
import { getEventSignature } from './getEventSignature.js';
import { keccak256 } from './keccak256.js';
const hash = (value) => keccak256(toBytes(value));
export const getEventSelector = (fn) => hash(getEventSignature(fn));
//# sourceMappingURL=getEventSelector.js.map