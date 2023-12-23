export declare const neonMainnet: import("../../types/utils.js").Assign<{
    readonly id: 245022934;
    readonly network: "neonMainnet";
    readonly name: "Neon EVM MainNet";
    readonly nativeCurrency: {
        readonly name: "NEON";
        readonly symbol: "NEON";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://neon-proxy-mainnet.solana.p2p.org"];
        };
        readonly public: {
            readonly http: readonly ["https://neon-proxy-mainnet.solana.p2p.org"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Neonscan";
            readonly url: "https://neonscan.org";
        };
    };
    readonly contracts: {};
    readonly testnet: false;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=neonMainnet.d.ts.map