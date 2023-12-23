export declare const fantomSonicTestnet: import("../../types/utils.js").Assign<{
    readonly id: 64240;
    readonly name: "Fantom Sonic Open Testnet";
    readonly network: "fantom-sonic-testnet";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Fantom";
        readonly symbol: "FTM";
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpcapi.sonic.fantom.network"];
        };
        readonly public: {
            readonly http: readonly ["https://rpcapi.sonic.fantom.network"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Fantom Sonic Open Testnet Explorer";
            readonly url: "https://public-sonic.fantom.network";
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=fantomSonicTestnet.d.ts.map