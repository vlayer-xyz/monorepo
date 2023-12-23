export declare const spicy: import("../../types/utils.js").Assign<{
    readonly id: 88882;
    readonly name: "Chiliz Spicy Testnet";
    readonly network: "chiliz-spicy-Testnet";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "CHZ";
        readonly symbol: "CHZ";
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://spicy-rpc.chiliz.com", "https://chiliz-spicy.publicnode.com"];
            readonly webSocket: readonly ["wss://spicy-rpc-ws.chiliz.com", "wss://chiliz-spicy.publicnode.com"];
        };
        readonly public: {
            readonly http: readonly ["https://spicy-rpc.chiliz.com", "https://chiliz-spicy.publicnode.com"];
            readonly webSocket: readonly ["wss://spicy-rpc-ws.chiliz.com", "wss://chiliz-spicy.publicnode.com"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Chiliz Explorer";
            readonly url: "http://spicy-explorer.chiliz.com";
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=spicy.d.ts.map