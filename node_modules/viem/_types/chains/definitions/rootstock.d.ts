export declare const rootstock: import("../../types/utils.js").Assign<{
    readonly id: 30;
    readonly name: "Rootstock Mainnet";
    readonly network: "rootstock";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Rootstock Bitcoin";
        readonly symbol: "RBTC";
    };
    readonly rpcUrls: {
        readonly public: {
            readonly http: readonly ["https://public-node.rsk.co"];
        };
        readonly default: {
            readonly http: readonly ["https://public-node.rsk.co"];
        };
    };
    readonly blockExplorers: {
        readonly blockscout: {
            readonly name: "Blockscout";
            readonly url: "https://rootstock.blockscout.com";
        };
        readonly default: {
            readonly name: "RSK Explorer";
            readonly url: "https://explorer.rsk.co";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 4249540;
        };
    };
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=rootstock.d.ts.map