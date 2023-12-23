"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseSepolia = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
const formatters_js_1 = require("../optimism/formatters.js");
exports.baseSepolia = (0, defineChain_js_1.defineChain)({
    id: 84532,
    network: 'base-sepolia',
    name: 'Base Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.base.org'],
        },
        public: {
            http: ['https://sepolia.base.org'],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'Blockscout',
            url: 'https://base-sepolia.blockscout.com',
        },
        default: {
            name: 'Blockscout',
            url: 'https://base-sepolia.blockscout.com',
        },
    },
    testnet: true,
    sourceId: 11155111,
}, {
    formatters: formatters_js_1.formattersOptimism,
});
//# sourceMappingURL=baseSepolia.js.map