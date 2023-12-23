export declare const tenet: import("../../types/utils.js").Assign<{
    readonly id: 1559;
    readonly name: "Tenet";
    readonly network: "tenet-mainnet";
    readonly nativeCurrency: {
        readonly name: "TENET";
        readonly symbol: "TENET";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly public: {
            readonly http: readonly ["https://rpc.tenet.org"];
        };
        readonly default: {
            readonly http: readonly ["https://rpc.tenet.org"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "TenetScan Mainnet";
            readonly url: "https://tenetscan.io";
        };
    };
    readonly testnet: false;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=tenet.d.ts.map