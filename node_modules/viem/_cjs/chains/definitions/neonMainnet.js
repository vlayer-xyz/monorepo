"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.neonMainnet = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.neonMainnet = (0, defineChain_js_1.defineChain)({
    id: 245022934,
    network: 'neonMainnet',
    name: 'Neon EVM MainNet',
    nativeCurrency: { name: 'NEON', symbol: 'NEON', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://neon-proxy-mainnet.solana.p2p.org'],
        },
        public: {
            http: ['https://neon-proxy-mainnet.solana.p2p.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Neonscan',
            url: 'https://neonscan.org',
        },
    },
    contracts: {},
    testnet: false,
});
//# sourceMappingURL=neonMainnet.js.map