"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenet = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.tenet = (0, defineChain_js_1.defineChain)({
    id: 1559,
    name: 'Tenet',
    network: 'tenet-mainnet',
    nativeCurrency: {
        name: 'TENET',
        symbol: 'TENET',
        decimals: 18,
    },
    rpcUrls: {
        public: { http: ['https://rpc.tenet.org'] },
        default: { http: ['https://rpc.tenet.org'] },
    },
    blockExplorers: {
        default: { name: 'TenetScan Mainnet', url: 'https://tenetscan.io' },
    },
    testnet: false,
});
//# sourceMappingURL=tenet.js.map