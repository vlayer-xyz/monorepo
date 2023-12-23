"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgn = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
const formatters_js_1 = require("../optimism/formatters.js");
exports.pgn = (0, defineChain_js_1.defineChain)({
    id: 424,
    network: 'pgn',
    name: 'PGN',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.publicgoods.network'],
        },
        public: {
            http: ['https://rpc.publicgoods.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'PGN Explorer',
            url: 'https://explorer.publicgoods.network',
        },
        blocksout: {
            name: 'PGN Explorer',
            url: 'https://explorer.publicgoods.network',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 3380209,
        },
    },
}, {
    formatters: formatters_js_1.formattersOptimism,
});
//# sourceMappingURL=pgn.js.map