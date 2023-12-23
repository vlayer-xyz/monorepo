"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIntervalMining = void 0;
async function setIntervalMining(client, { interval }) {
    const interval_ = (() => {
        if (client.mode === 'hardhat')
            return interval * 1000;
        return interval;
    })();
    await client.request({
        method: 'evm_setIntervalMining',
        params: [interval_],
    });
}
exports.setIntervalMining = setIntervalMining;
//# sourceMappingURL=setIntervalMining.js.map