"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgnTestnet = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
const formatters_js_1 = require("../optimism/formatters.js");
exports.pgnTestnet = (0, defineChain_js_1.defineChain)({
    id: 58008,
    network: 'pgn-testnet',
    name: 'PGN ',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.publicgoods.network'],
        },
        public: {
            http: ['https://sepolia.publicgoods.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'PGN Testnet Explorer',
            url: 'https://explorer.sepolia.publicgoods.network',
        },
        blocksout: {
            name: 'PGN Testnet Explorer',
            url: 'https://explorer.sepolia.publicgoods.network',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 3754925,
        },
    },
    testnet: true,
}, {
    formatters: formatters_js_1.formattersOptimism,
});
//# sourceMappingURL=pgnTestnet.js.map