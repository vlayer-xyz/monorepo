"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollSepolia = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.scrollSepolia = (0, defineChain_js_1.defineChain)({
    id: 534351,
    name: 'Scroll Sepolia',
    network: 'scroll-sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia-rpc.scroll.io'],
        },
        public: {
            http: ['https://sepolia-rpc.scroll.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://sepolia-blockscout.scroll.io',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 9473,
        },
    },
    testnet: true,
});
//# sourceMappingURL=scrollSepolia.js.map