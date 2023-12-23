"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.astarZkatana = void 0;
const defineChain_js_1 = require("../../utils/chain/defineChain.js");
exports.astarZkatana = (0, defineChain_js_1.defineChain)({
    id: 1261120,
    name: 'Astar zkEVM Testnet zKatana',
    network: 'zKatana',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: [
                'https://rpc.zkatana.gelato.digital',
                'https://rpc.startale.com/zkatana',
            ],
        },
        public: {
            http: [
                'https://rpc.zkatana.gelato.digital',
                'https://rpc.startale.com/zkatana',
            ],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'Blockscout zKatana chain explorer',
            url: 'https://zkatana.blockscout.com',
        },
        default: {
            name: 'zKatana Explorer',
            url: 'https://zkatana.explorer.startale.com',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 31317,
        },
    },
    testnet: true,
});
//# sourceMappingURL=astarZkatana.js.map