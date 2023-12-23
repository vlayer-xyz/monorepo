export declare const confluxESpaceTestnet: import("../../types/utils.js").Assign<{
    readonly id: 71;
    readonly name: "Conflux eSpace Testnet";
    readonly network: "cfx-espace-testnet";
    readonly testnet: true;
    readonly nativeCurrency: {
        readonly name: "Conflux";
        readonly symbol: "CFX";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://evmtestnet.confluxrpc.org"];
            readonly webSocket: readonly ["wss://evmtestnet.confluxrpc.org/ws"];
        };
        readonly public: {
            readonly http: readonly ["https://evmtestnet.confluxrpc.org"];
            readonly webSocket: readonly ["wss://evmtestnet.confluxrpc.org/ws"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "ConfluxScan";
            readonly url: "https://evmtestnet.confluxscan.io";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xEFf0078910f638cd81996cc117bccD3eDf2B072F";
            readonly blockCreated: 117499050;
        };
    };
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=confluxESpaceTestnet.d.ts.map