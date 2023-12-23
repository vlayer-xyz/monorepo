"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taikoJolnir = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.taikoJolnir = (0, defineChain_js_1.defineChain)({
    id: 167007,
    name: 'Taiko Jolnir L2',
    network: 'tko-jolnir',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://jolnir.taiko.xyz'],
        },
        public: {
            http: ['https://jolnir.taiko.xyz'],
        },
    },
    blockExplorers: {
        default: {
            name: 'blockscout',
            url: 'https://explorer.jolnir.taiko.xyz',
        },
    },
});
//# sourceMappingURL=taikoJolnir.js.map