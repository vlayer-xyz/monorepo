"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBlockTimestampInterval = void 0;
async function setBlockTimestampInterval(client, { interval }) {
    const interval_ = (() => {
        if (client.mode === 'hardhat')
            return interval * 1000;
        return interval;
    })();
    await client.request({
        method: `${client.mode}_setBlockTimestampInterval`,
        params: [interval_],
    });
}
exports.setBlockTimestampInterval = setBlockTimestampInterval;
//# sourceMappingURL=setBlockTimestampInterval.js.map