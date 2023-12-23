export declare const gnosisChiado: import("../../types/utils.js").Assign<{
    readonly id: 10200;
    readonly name: "Gnosis Chiado";
    readonly network: "chiado";
    readonly nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Gnosis";
        readonly symbol: "xDAI";
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.chiadochain.net"];
            readonly webSocket: readonly ["wss://rpc.chiadochain.net/wss"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.chiadochain.net"];
            readonly webSocket: readonly ["wss://rpc.chiadochain.net/wss"];
        };
    };
    readonly blockExplorers: {
        readonly default: {
            readonly name: "Blockscout";
            readonly url: "https://blockscout.chiadochain.net";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 4967313;
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=gnosisChiado.d.ts.map