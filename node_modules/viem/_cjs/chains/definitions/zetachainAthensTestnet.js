"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zetachainAthensTestnet = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.zetachainAthensTestnet = (0, defineChain_js_1.defineChain)({
    id: 7001,
    name: 'ZetaChain Athens Testnet',
    network: 'zetachain-athens-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Zeta',
        symbol: 'aZETA',
    },
    rpcUrls: {
        public: {
            http: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'],
        },
        default: {
            http: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'],
        },
    },
    blockExplorers: {
        default: {
            name: 'ZetaScan',
            url: 'https://athens3.explorer.zetachain.com',
        },
    },
    testnet: true,
});
//# sourceMappingURL=zetachainAthensTestnet.js.map