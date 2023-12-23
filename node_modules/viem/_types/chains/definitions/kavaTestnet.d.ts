export declare const kavaTestnet: import("../../types/utils.js").Assign<{
    readonly id: 2221;
    readonly name: "Kava EVM Testnet";
    readonly network: "kava-testnet";
    readonly nativeCurrency: {
        readonly name: "Kava";
        readonly symbol: "KAVA";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly public: {
            readonly http: readonly ["https://evm.testnet.kava.io"];
        };
        readonly default: {
            readonly http: readonly ["https://evm.testnet.kava.io"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Kava EVM Testnet Explorer";
            readonly url: "https://testnet.kavascan.com/";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xDf1D724A7166261eEB015418fe8c7679BBEa7fd6";
            readonly blockCreated: 7242179;
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=kavaTestnet.d.ts.map