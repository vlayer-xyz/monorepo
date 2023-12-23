"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dogechain = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.dogechain = (0, defineChain_js_1.defineChain)({
    id: 2000,
    name: 'Dogechain',
    network: 'dogechain',
    nativeCurrency: {
        decimals: 18,
        name: 'Dogechain',
        symbol: 'DC',
    },
    rpcUrls: {
        default: { http: ['https://rpc.dogechain.dog'] },
        public: { http: ['https://rpc.dogechain.dog'] },
    },
    blockExplorers: {
        etherscan: {
            name: 'DogeChainExplorer',
            url: 'https://explorer.dogechain.dog',
        },
        default: {
            name: 'DogeChainExplorer',
            url: 'https://explorer.dogechain.dog',
        },
    },
});
//# sourceMappingURL=dogechain.js.map