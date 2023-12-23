export declare const zilliqa: import("../../types/utils.js").Assign<{
    readonly id: 32769;
    readonly name: "Zilliqa";
    readonly network: "zilliqa";
    readonly nativeCurrency: {
        readonly name: "Zilliqa";
        readonly symbol: "ZIL";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.zilliqa.com"];
        };
        readonly public: {
            readonly http: readonly ["https://api.zilliqa.com"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Ethernal";
            readonly url: "https://evmx.zilliqa.com";
        };
    };
    readonly testnet: false;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=zilliqa.d.ts.map