export declare const aurora: import("../../types/utils.js").Assign<{
    readonly id: 1313161554;
    readonly name: "Aurora";
    readonly network: "aurora";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Ether";
        readonly symbol: "ETH";
    };
    readonly rpcUrls: {
        readonly infura: {
            readonly http: readonly ["https://aurora-mainnet.infura.io/v3"];
        };
        readonly default: {
            readonly http: readonly ["https://mainnet.aurora.dev"];
        };
        readonly public: {
            readonly http: readonly ["https://mainnet.aurora.dev"];
        };
    };
    readonly blockExplorers: {
        readonly etherscan: {
            readonly name: "Aurorascan";
            readonly url: "https://aurorascan.dev";
        };
        readonly default: {
            readonly name: "Aurorascan";
            readonly url: "https://aurorascan.dev";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
            readonly blockCreated: 62907816;
        };
    };
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=aurora.d.ts.map