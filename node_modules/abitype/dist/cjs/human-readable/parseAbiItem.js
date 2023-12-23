"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAbiItem = void 0;
const index_js_1 = require("../index.js");
const signatures_js_1 = require("./runtime/signatures.js");
const structs_js_1 = require("./runtime/structs.js");
const utils_js_1 = require("./runtime/utils.js");
function parseAbiItem(signature) {
    let abiItem;
    if (typeof signature === 'string')
        abiItem = (0, utils_js_1.parseSignature)(signature);
    else {
        const structs = (0, structs_js_1.parseStructs)(signature);
        const length = signature.length;
        for (let i = 0; i < length; i++) {
            const signature_ = signature[i];
            if ((0, signatures_js_1.isStructSignature)(signature_))
                continue;
            abiItem = (0, utils_js_1.parseSignature)(signature_, structs);
            break;
        }
    }
    if (!abiItem)
        throw new index_js_1.InvalidAbiItemError({ signature });
    return abiItem;
}
exports.parseAbiItem = parseAbiItem;
//# sourceMappingURL=parseAbiItem.js.map