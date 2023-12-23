"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skaleTitan = void 0;
const defineChain_js_1 = require("../../../utils/chain/defineChain.js");
exports.skaleTitan = (0, defineChain_js_1.defineChain)({
    id: 1350216234,
    name: 'SKALE | Titan Community Hub',
    network: 'skale-titan',
    nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.skalenodes.com/v1/parallel-stormy-spica'],
            webSocket: ['wss://mainnet.skalenodes.com/v1/ws/parallel-stormy-spica'],
        },
        public: {
            http: ['https://mainnet.skalenodes.com/v1/parallel-stormy-spica'],
            webSocket: ['wss://mainnet.skalenodes.com/v1/ws/parallel-stormy-spica'],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'SKALE Explorer',
            url: 'https://parallel-stormy-spica.explorer.mainnet.skalenodes.com',
        },
        default: {
            name: 'SKALE Explorer',
            url: 'https://parallel-stormy-spica.explorer.mainnet.skalenodes.com',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 2076458,
        },
    },
});
//# sourceMappingURL=titan.js.map