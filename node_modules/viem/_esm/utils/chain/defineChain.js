export function defineChain(chain, config = {}) {
    const { fees = chain.fees, formatters = chain.formatters, serializers = chain.serializers, } = config;
    return {
        ...chain,
        fees,
        formatters,
        serializers,
    };
}
//# sourceMappingURL=defineChain.js.map