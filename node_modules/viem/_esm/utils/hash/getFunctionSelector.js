import { slice } from '../data/slice.js';
import { toBytes } from '../encoding/toBytes.js';
import { getFunctionSignature, } from './getFunctionSignature.js';
import { keccak256 } from './keccak256.js';
const hash = (value) => keccak256(toBytes(value));
export const getFunctionSelector = (fn) => slice(hash(getFunctionSignature(fn)), 0, 4);
//# sourceMappingURL=getFunctionSelector.js.map