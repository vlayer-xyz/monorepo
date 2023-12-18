import {describe, it} from 'vitest'
import {Alchemy, Network} from "alchemy-sdk";

const address = '0xe9c3123e4cf348c66b20a985af264891fc0a441a';
const blockNumber = "0x" + (18800000).toString(16);

const settings = {
    apiKey: "7GQAM03mTl41iy94ax_ORT4fzoQC2oHY",
    network: Network.ETH_MAINNET,
};

describe('alchemy', () => {
    it('get proof', async () => {
        const alchemy = new Alchemy(settings);
        const res = await alchemy.core.send('eth_getProof', [address, [], blockNumber]);
        // console.log(res)
    })
})
