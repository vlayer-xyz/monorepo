export declare const klaytn: import("../../types/utils.js").Assign<{
    readonly id: 8217;
    readonly name: "Klaytn";
    readonly network: "klaytn";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Klaytn";
        readonly symbol: "KLAY";
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://klaytn.drpc.org"];
        };
        readonly public: {
            readonly http: readonly ["https://klaytn.drpc.org"];
        };
    };
    readonly blockExplorers: {
        readonly etherscan: {
            readonly name: "KlaytnScope";
            readonly url: "https://scope.klaytn.com";
        };
        readonly default: {
            readonly name: "KlaytnScope";
            readonly url: "https://scope.klaytn.com";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 96002415;
        };
    };
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=klaytn.d.ts.map