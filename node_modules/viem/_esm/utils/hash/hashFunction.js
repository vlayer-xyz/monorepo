import { formatAbiItem, } from '../abi/formatAbiItem.js';
import { toBytes } from '../encoding/toBytes.js';
import { getFunctionSignature, } from './getFunctionSignature.js';
import { keccak256 } from './keccak256.js';
const hash = (value) => keccak256(toBytes(value));
export function hashFunction(def) {
    return hash(getFunctionSignature(def));
}
export function hashAbiItem(abiItem) {
    return hash(formatAbiItem(abiItem));
}
//# sourceMappingURL=hashFunction.js.map