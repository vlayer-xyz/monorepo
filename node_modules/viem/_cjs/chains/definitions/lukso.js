"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lukso = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.lukso = (0, defineChain_js_1.defineChain)({
    id: 42,
    network: 'lukso',
    name: 'LUKSO',
    nativeCurrency: {
        name: 'LUKSO',
        symbol: 'LYX',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.mainnet.lukso.network'],
            webSocket: ['wss://ws-rpc.mainnet.lukso.network'],
        },
        public: {
            http: ['https://rpc.mainnet.lukso.network'],
            webSocket: ['wss://ws-rpc.mainnet.lukso.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'LUKSO Mainnet Explorer',
            url: 'https://explorer.execution.mainnet.lukso.network',
        },
    },
});
//# sourceMappingURL=lukso.js.map