"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadState = void 0;
async function loadState(client, { state }) {
    await client.request({
        method: `${client.mode}_loadState`,
        params: [state],
    });
}
exports.loadState = loadState;
//# sourceMappingURL=loadState.js.map