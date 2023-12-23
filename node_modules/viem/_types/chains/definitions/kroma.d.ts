export declare const kroma: import("../../types/utils.js").Assign<{
    readonly id: 255;
    readonly network: "kroma";
    readonly name: "Kroma";
    readonly nativeCurrency: {
        readonly name: "ETH";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.kroma.network"];
        };
        readonly public: {
            readonly http: readonly ["https://api.kroma.network"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Kroma Explorer";
            readonly url: "https://blockscout.kroma.network";
        };
    };
    readonly testnet: false;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=kroma.d.ts.map