"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProof = void 0;
const toHex_js_1 = require("../../utils/encoding/toHex.js");
const proof_js_1 = require("../../utils/formatters/proof.js");
async function getProof(client, { address, blockNumber, blockTag: blockTag_, storageKeys, }) {
    const blockTag = blockTag_ ?? 'latest';
    const blockNumberHex = blockNumber !== undefined ? (0, toHex_js_1.numberToHex)(blockNumber) : undefined;
    const proof = await client.request({
        method: 'eth_getProof',
        params: [address, storageKeys, blockNumberHex || blockTag],
    });
    return (0, proof_js_1.formatProof)(proof);
}
exports.getProof = getProof;
//# sourceMappingURL=getProof.js.map