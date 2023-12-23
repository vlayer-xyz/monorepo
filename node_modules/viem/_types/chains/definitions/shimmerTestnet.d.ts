export declare const shimmerTestnet: import("../../types/utils.js").Assign<{
    readonly id: 1073;
    readonly name: "Shimmer Testnet";
    readonly network: "shimmer-testnet";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Shimmer";
        readonly symbol: "SMR";
    };
    readonly rpcUrls: {
        readonly public: {
            readonly http: readonly ["https://json-rpc.evm.testnet.shimmer.network"];
        };
        readonly default: {
            readonly http: readonly ["https://json-rpc.evm.testnet.shimmer.network"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Shimmer Network Explorer";
            readonly url: "https://explorer.evm.testnet.shimmer.network";
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=shimmerTestnet.d.ts.map