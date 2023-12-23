import { InvalidAbiItemError } from '../index.js';
import { isStructSignature } from './runtime/signatures.js';
import { parseStructs } from './runtime/structs.js';
import { parseSignature } from './runtime/utils.js';
export function parseAbiItem(signature) {
    let abiItem;
    if (typeof signature === 'string')
        abiItem = parseSignature(signature);
    else {
        const structs = parseStructs(signature);
        const length = signature.length;
        for (let i = 0; i < length; i++) {
            const signature_ = signature[i];
            if (isStructSignature(signature_))
                continue;
            abiItem = parseSignature(signature_, structs);
            break;
        }
    }
    if (!abiItem)
        throw new InvalidAbiItemError({ signature });
    return abiItem;
}
//# sourceMappingURL=parseAbiItem.js.map