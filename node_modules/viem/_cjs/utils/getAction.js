"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAction = void 0;
function getAction(client, action, name) {
    return (params) => client[action.name || name]?.(params) ?? action(client, params);
}
exports.getAction = getAction;
//# sourceMappingURL=getAction.js.map