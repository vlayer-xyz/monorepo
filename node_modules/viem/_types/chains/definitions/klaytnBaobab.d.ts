export declare const klaytnBaobab: import("../../types/utils.js").Assign<{
    readonly id: 1001;
    readonly name: "Klaytn Baobab Testnet";
    readonly network: "klaytn-baobab";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Baobab Klaytn";
        readonly symbol: "KLAY";
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://public-en-baobab.klaytn.net"];
        };
        readonly public: {
            readonly http: readonly ["https://public-en-baobab.klaytn.net"];
        };
    };
    readonly blockExplorers: {
        readonly etherscan: {
            readonly name: "KlaytnScope";
            readonly url: "https://baobab.klaytnscope.com";
        };
        readonly default: {
            readonly name: "KlaytnScope";
            readonly url: "https://baobab.klaytnscope.com";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 123390593;
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=klaytnBaobab.d.ts.map