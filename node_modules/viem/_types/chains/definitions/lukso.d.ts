export declare const lukso: import("../../types/utils.js").Assign<{
    readonly id: 42;
    readonly network: "lukso";
    readonly name: "LUKSO";
    readonly nativeCurrency: {
        readonly name: "LUKSO";
        readonly symbol: "LYX";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.mainnet.lukso.network"];
            readonly webSocket: readonly ["wss://ws-rpc.mainnet.lukso.network"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.mainnet.lukso.network"];
            readonly webSocket: readonly ["wss://ws-rpc.mainnet.lukso.network"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "LUKSO Mainnet Explorer";
            readonly url: "https://explorer.execution.mainnet.lukso.network";
        };
    };
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=lukso.d.ts.map