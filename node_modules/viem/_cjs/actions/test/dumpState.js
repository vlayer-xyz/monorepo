"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpState = void 0;
async function dumpState(client) {
    return client.request({
        method: `${client.mode}_dumpState`,
    });
}
exports.dumpState = dumpState;
//# sourceMappingURL=dumpState.js.map