"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compactSignatureToSignature = void 0;
const toBytes_js_1 = require("../encoding/toBytes.js");
const toHex_js_1 = require("../encoding/toHex.js");
function compactSignatureToSignature({ r, yParityAndS, }) {
    const yParityAndS_bytes = (0, toBytes_js_1.hexToBytes)(yParityAndS);
    const v = yParityAndS_bytes[0] & 0x80 ? 28n : 27n;
    const s = yParityAndS_bytes;
    if (v === 28n)
        s[0] &= 0x7f;
    return { r, s: (0, toHex_js_1.bytesToHex)(s), v };
}
exports.compactSignatureToSignature = compactSignatureToSignature;
//# sourceMappingURL=compactSignatureToSignature.js.map