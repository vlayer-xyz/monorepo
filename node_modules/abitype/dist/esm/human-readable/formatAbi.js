import { formatAbiItem } from './formatAbiItem.js';
export function formatAbi(abi) {
    const signatures = [];
    const length = abi.length;
    for (let i = 0; i < length; i++) {
        const abiItem = abi[i];
        const signature = formatAbiItem(abiItem);
        signatures.push(signature);
    }
    return signatures;
}
//# sourceMappingURL=formatAbi.js.map