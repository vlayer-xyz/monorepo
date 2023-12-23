"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modeTestnet = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.modeTestnet = (0, defineChain_js_1.defineChain)({
    id: 919,
    name: 'Mode Testnet',
    network: 'mode-testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.mode.network'],
        },
        public: {
            http: ['https://sepolia.mode.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://sepolia.explorer.mode.network',
        },
    },
    contracts: {
        multicall3: {
            address: '0xBAba8373113Fb7a68f195deF18732e01aF8eDfCF',
            blockCreated: 3019007,
        },
    },
    testnet: true,
});
//# sourceMappingURL=modeTestnet.js.map