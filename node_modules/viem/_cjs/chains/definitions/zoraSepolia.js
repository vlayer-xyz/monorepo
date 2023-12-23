"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoraSepolia = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
const formatters_js_1 = require("../optimism/formatters.js");
exports.zoraSepolia = (0, defineChain_js_1.defineChain)({
    id: 999999999,
    name: 'Zora Sepolia',
    network: 'zora-sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'Zora Sepolia',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.rpc.zora.energy'],
            webSocket: ['wss://sepolia.rpc.zora.energy'],
        },
        public: {
            http: ['https://sepolia.rpc.zora.energy'],
            webSocket: ['wss://sepolia.rpc.zora.energy'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Zora Sepolia Explorer',
            url: 'https://sepolia.explorer.zora.energy/',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 83160,
        },
    },
    testnet: true,
}, {
    formatters: formatters_js_1.formattersOptimism,
});
//# sourceMappingURL=zoraSepolia.js.map