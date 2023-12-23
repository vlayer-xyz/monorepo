export declare const astar: import("../../types/utils.js").Assign<{
    readonly id: 592;
    readonly name: "Astar";
    readonly network: "astar-mainnet";
    readonly nativeCurrency: {
        readonly name: "Astar";
        readonly symbol: "ASTR";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly public: {
            readonly http: readonly ["https://astar.api.onfinality.io/public"];
        };
        readonly default: {
            readonly http: readonly ["https://astar.api.onfinality.io/public"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Astar Subscan";
            readonly url: "https://astar.subscan.io";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
            readonly blockCreated: 761794;
        };
    };
    readonly testnet: false;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=astar.d.ts.map