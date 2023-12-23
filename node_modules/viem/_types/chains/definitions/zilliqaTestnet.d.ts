export declare const zilliqaTestnet: import("../../types/utils.js").Assign<{
    readonly id: 33101;
    readonly name: "Zilliqa Testnet";
    readonly network: "zilliqa-testnet";
    readonly nativeCurrency: {
        readonly name: "Zilliqa";
        readonly symbol: "ZIL";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://dev-api.zilliqa.com"];
        };
        readonly public: {
            readonly http: readonly ["https://dev-api.zilliqa.com"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Ethernal";
            readonly url: "https://evmx.testnet.zilliqa.com";
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=zilliqaTestnet.d.ts.map