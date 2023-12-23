export declare const holesky: import("../../types/utils.js").Assign<{
    readonly id: 17000;
    readonly network: "holesky";
    readonly name: "Holesky";
    readonly nativeCurrency: {
        readonly name: "Holesky Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://ethereum-holesky.publicnode.com"];
        };
        readonly public: {
            readonly http: readonly ["https://ethereum-holesky.publicnode.com"];
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
            readonly blockCreated: 77;
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=holesky.d.ts.map