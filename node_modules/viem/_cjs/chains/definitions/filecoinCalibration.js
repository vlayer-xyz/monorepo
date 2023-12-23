"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filecoinCalibration = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.filecoinCalibration = (0, defineChain_js_1.defineChain)({
    id: 314159,
    name: 'Filecoin Calibration',
    network: 'filecoin-calibration',
    nativeCurrency: {
        decimals: 18,
        name: 'testnet filecoin',
        symbol: 'tFIL',
    },
    rpcUrls: {
        default: { http: ['https://api.calibration.node.glif.io/rpc/v1'] },
        public: { http: ['https://api.calibration.node.glif.io/rpc/v1'] },
    },
    blockExplorers: {
        default: { name: 'Filscan', url: 'https://calibration.filscan.io' },
    },
});
//# sourceMappingURL=filecoinCalibration.js.map