# CryptoPunk Ownership Proof

Prove you own a CryptoPunk NFT without revealing your wallet address or token ID on-chain.

## Overview

This circuit generates a zero-knowledge proof that verifies ownership of a CryptoPunk NFT at a specific block number, while keeping both the wallet address and token ID private.

## Use Cases

- **Private NFT verification** for exclusive CryptoPunk communities
- **Anonymous proof of membership** in OG NFT holders group
- **Wallet privacy** - prove ownership without exposing your address
- **Punk privacy** - prove you own a CryptoPunk without revealing which one

## How It Works

The circuit:

1. Takes your wallet address as a **private input**
2. Takes the token ID as a **private input** (Field type)
3. Takes the block number as a **public input**
4. Queries the CryptoPunk contract at that block to get the token owner
5. Verifies the owner matches your wallet address
6. Generates a proof without revealing private inputs

## Code Explanation

```noir
fn main(wallet_address: Address, token_id: Field, block_number: pub u64) {
    let owner = CRYPTO_PUNK().get_owner(field_to_bytes32(token_id), block_number);
    assert_eq(owner, wallet_address, "Owner is not the same as the wallet address");
}
```

- `wallet_address` - Your Ethereum address (private)
- `token_id` - The CryptoPunk token ID you own as Field type (private)
- `block_number` - Ethereum block number to query (public)
- `CRYPTO_PUNK()` - vlayer library function to access CryptoPunk contract
- `field_to_bytes32()` - Converts Field to bytes32 format for contract query
- `get_owner()` - Retrieves the owner of the punk at specified block
- `assert_eq()` - Proves ownership by comparing addresses

## Running This Example

### Compile the circuit

```bash
nargo compile
```

### Configure your inputs

Edit `Prover.toml` with your values:

```toml
wallet_address = "0x..." # Your wallet address
token_id = "1234" # Your CryptoPunk ID (0-9999)
block_number = "12345678" # Block number to query
```

### Generate proof

```bash
nargo prove
```

### Verify proof

```bash
nargo verify
```

## Privacy Guarantees

**What is revealed:**
- That you own *some* CryptoPunk at the specified block
- The block number used for verification

**What stays private:**
- Your wallet address
- Which CryptoPunk you own (token ID 0-9999)
- Any other holdings in your wallet

## Real-World Applications

- **OG NFT holder verification** - Prove you're an early adopter without doxxing
- **Exclusive events** - Verify attendance eligibility anonymously  
- **Private communities** - Join punk holder groups without revealing identity
- **Anonymous voting** - Participate in punk DAO decisions privately

## CryptoPunk Context

CryptoPunks are one of the earliest NFT projects on Ethereum (2017), consisting of 10,000 unique 24x24 pixel art characters. This circuit works with the original CryptoPunk contract.

## Learn More

- [CryptoPunks Contract](https://etherscan.io/address/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb)
- [vlayer Documentation](https://docs.vlayer.xyz)
- [Noir Language](https://noir-lang.org)
