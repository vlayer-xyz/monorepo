export declare const sapphireTestnet: import("../../types/utils.js").Assign<{
    readonly id: 23295;
    readonly name: "Oasis Sapphire Testnet";
    readonly network: "sapphire-testnet";
    readonly nativeCurrency: {
        readonly name: "Sapphire Test Rose";
        readonly symbol: "TEST";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://testnet.sapphire.oasis.dev"];
            readonly webSocket: readonly ["wss://testnet.sapphire.oasis.dev/ws"];
        };
        readonly public: {
            readonly http: readonly ["https://testnet.sapphire.oasis.dev"];
            readonly webSocket: readonly ["wss://testnet.sapphire.oasis.dev/ws"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Oasis Sapphire Testnet Explorer";
            readonly url: "https://testnet.explorer.sapphire.oasis.dev";
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=sapphireTestnet.d.ts.map