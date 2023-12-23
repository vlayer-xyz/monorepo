export declare const coreDao: import("../../types/utils.js").Assign<{
    readonly id: 1116;
    readonly name: "Core Dao";
    readonly network: "coreDao";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Core";
        readonly symbol: "CORE";
    };
    readonly rpcUrls: {
        readonly public: {
            readonly http: readonly ["https://rpc.coredao.org"];
        };
        readonly default: {
            readonly http: readonly ["https://rpc.coredao.org"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "CoreDao";
            readonly url: "https://scan.coredao.org";
        };
        readonly etherscan: {
            readonly name: "CoreDao";
            readonly url: "https://scan.coredao.org";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 11907934;
        };
    };
    readonly testnet: false;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=coreDao.d.ts.map