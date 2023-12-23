export declare const mantaTestnet: import("../../types/utils.js").Assign<{
    readonly id: 3441005;
    readonly name: "Manta Pacific Testnet";
    readonly network: "manta-testnet";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "ETH";
        readonly symbol: "ETH";
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://manta-testnet.calderachain.xyz/http"];
        };
        readonly public: {
            readonly http: readonly ["https://manta-testnet.calderachain.xyz/http"];
        };
    };
    readonly blockExplorers: {
        readonly etherscan: {
            readonly name: "Manta Testnet Explorer";
            readonly url: "https://pacific-explorer.testnet.manta.network";
        };
        readonly default: {
            readonly name: "Manta Testnet Explorer";
            readonly url: "https://pacific-explorer.testnet.manta.network";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0x211B1643b95Fe76f11eD8880EE810ABD9A4cf56C";
            readonly blockCreated: 419915;
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=mantaTestnet.d.ts.map