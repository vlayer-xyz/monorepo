export declare const manta: import("../../types/utils.js").Assign<{
    readonly id: 169;
    readonly name: "Manta Pacific Mainnet";
    readonly network: "manta";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "ETH";
        readonly symbol: "ETH";
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://pacific-rpc.manta.network/http"];
        };
        readonly public: {
            readonly http: readonly ["https://pacific-rpc.manta.network/http"];
        };
    };
    readonly blockExplorers: {
        readonly etherscan: {
            readonly name: "Manta Explorer";
            readonly url: "https://pacific-explorer.manta.network";
        };
        readonly default: {
            readonly name: "Manta Explorer";
            readonly url: "https://pacific-explorer.manta.network";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 332890;
        };
    };
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=manta.d.ts.map