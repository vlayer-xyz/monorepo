"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimismSepolia = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
const formatters_js_1 = require("../optimism/formatters.js");
exports.optimismSepolia = (0, defineChain_js_1.defineChain)({
    id: 11155420,
    name: 'Optimism Sepolia',
    network: 'optimism-sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.optimism.io'],
        },
        public: {
            http: ['https://sepolia.optimism.io'],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'Blockscout',
            url: 'https://optimism-sepolia.blockscout.com',
        },
        default: {
            name: 'Blockscout',
            url: 'https://optimism-sepolia.blockscout.com',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1620204,
        },
    },
    testnet: true,
}, {
    formatters: formatters_js_1.formattersOptimism,
});
//# sourceMappingURL=optimismSepolia.js.map