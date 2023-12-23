"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.klaytn = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.klaytn = (0, defineChain_js_1.defineChain)({
    id: 8217,
    name: 'Klaytn',
    network: 'klaytn',
    nativeCurrency: {
        decimals: 18,
        name: 'Klaytn',
        symbol: 'KLAY',
    },
    rpcUrls: {
        default: { http: ['https://klaytn.drpc.org'] },
        public: { http: ['https://klaytn.drpc.org'] },
    },
    blockExplorers: {
        etherscan: { name: 'KlaytnScope', url: 'https://scope.klaytn.com' },
        default: { name: 'KlaytnScope', url: 'https://scope.klaytn.com' },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 96002415,
        },
    },
});
//# sourceMappingURL=klaytn.js.map