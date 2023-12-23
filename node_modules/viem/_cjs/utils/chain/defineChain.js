"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineChain = void 0;
function defineChain(chain, config = {}) {
    const { fees = chain.fees, formatters = chain.formatters, serializers = chain.serializers, } = config;
    return {
        ...chain,
        fees,
        formatters,
        serializers,
    };
}
exports.defineChain = defineChain;
//# sourceMappingURL=defineChain.js.map