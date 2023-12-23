export declare const astarZkatana: import("../../types/utils.js").Assign<{
    readonly id: 1261120;
    readonly name: "Astar zkEVM Testnet zKatana";
    readonly network: "zKatana";
    readonly nativeCurrency: {
        readonly name: "Ether";
        readonly symbol: "ETH";
        readonly decimals: 18;
    };
    readonly rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.zkatana.gelato.digital", "https://rpc.startale.com/zkatana"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.zkatana.gelato.digital", "https://rpc.startale.com/zkatana"];
        };
    };
    readonly blockExplorers: {
        readonly blockscout: {
            readonly name: "Blockscout zKatana chain explorer";
            readonly url: "https://zkatana.blockscout.com";
        };
        readonly default: {
            readonly name: "zKatana Explorer";
            readonly url: "https://zkatana.explorer.startale.com";
        };
    };
    readonly contracts: {
        readonly multicall3: {
            readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
            readonly blockCreated: 31317;
        };
    };
    readonly testnet: true;
}, import("../../types/chain.js").ChainConfig<undefined>>;
//# sourceMappingURL=astarZkatana.d.ts.map