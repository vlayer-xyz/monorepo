export declare const shibarium: import("../../types/utils.js").Assign<{
    readonly id: 109;
    readonly name: "Shibarium";
    readonly network: "shibarium";
    readonly nativeCurrency: {
        readonly name: "Bone";
        readonly symbol: "BONE";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.shibrpc.com"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.shibrpc.com"];
        };
    };
    readonly blockExplorers: {
        readonly etherscan: {
            readonly name: "Blockscout";
            readonly url: "https://shibariumscan.io";
        };
        readonly default: {
            readonly name: "Blockscout";
            readonly url: "https://shibariumscan.io";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0x864Bf681ADD6052395188A89101A1B37d3B4C961";
            readonly blockCreated: 265900;
        };
    };
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=shibarium.d.ts.map