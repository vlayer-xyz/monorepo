"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aurora = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.aurora = (0, defineChain_js_1.defineChain)({
    id: 1313161554,
    name: 'Aurora',
    network: 'aurora',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        infura: { http: ['https://aurora-mainnet.infura.io/v3'] },
        default: { http: ['https://mainnet.aurora.dev'] },
        public: { http: ['https://mainnet.aurora.dev'] },
    },
    blockExplorers: {
        etherscan: { name: 'Aurorascan', url: 'https://aurorascan.dev' },
        default: { name: 'Aurorascan', url: 'https://aurorascan.dev' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 62907816,
        },
    },
});
//# sourceMappingURL=aurora.js.map