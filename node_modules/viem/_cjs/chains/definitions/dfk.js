"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dfk = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.dfk = (0, defineChain_js_1.defineChain)({
    id: 53935,
    name: 'DFK Chain',
    network: 'dfk',
    nativeCurrency: {
        decimals: 18,
        name: 'Jewel',
        symbol: 'JEWEL',
    },
    rpcUrls: {
        default: {
            http: ['https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc'],
        },
        public: {
            http: ['https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc'],
        },
    },
    blockExplorers: {
        etherscan: {
            name: 'DFKSubnetScan',
            url: 'https://subnets.avax.network/defi-kingdoms',
        },
        default: {
            name: 'DFKSubnetScan',
            url: 'https://subnets.avax.network/defi-kingdoms',
        },
    },
});
//# sourceMappingURL=dfk.js.map