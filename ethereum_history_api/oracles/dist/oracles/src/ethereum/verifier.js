import ultraVerifier from '../../../contracts/out/UltraVerifier.sol/UltraVerifier.json';
import { decodeHexString } from '../noir/noir_js/encode.js';
export async function verifyStorageProofInSolidity(client, account, contractAddress, proof, witnessMap) {
    return await client.writeContract({
        account,
        address: contractAddress,
        abi: ultraVerifier.abi,
        functionName: 'verify',
        args: [decodeHexString(proof), Array.from(witnessMap.values())],
        chain: client.chain
    });
}
