export declare const kava: import("../../types/utils.js").Assign<{
    readonly id: 2222;
    readonly name: "Kava EVM";
    readonly network: "kava-mainnet";
    readonly nativeCurrency: {
        readonly name: "Kava";
        readonly symbol: "KAVA";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly public: {
            readonly http: readonly ["https://evm.kava.io"];
        };
        readonly default: {
            readonly http: readonly ["https://evm.kava.io"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Kava EVM Explorer";
            readonly url: "https://kavascan.com";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
            readonly blockCreated: 3661165;
        };
    };
    readonly testnet: false;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=kava.d.ts.map