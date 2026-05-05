# Bored Ape Yacht Club Ownership Proof

Prove you own a Bored Ape NFT without revealing your wallet address or token ID on-chain.

## Overview

This circuit generates a zero-knowledge proof that verifies ownership of a Bored Ape Yacht Club NFT at a specific block number, while keeping both the wallet address and token ID private.

## Use Cases

- **Private NFT verification** for exclusive communities and gated access
- **Anonymous proof of membership** in BAYC holders group
- **Wallet privacy** - prove ownership without exposing your address
- **Token privacy** - prove you own a BAYC without revealing which one

## How It Works

The circuit:

1. Takes your wallet address as a **private input**
2. Takes the token ID as a **private input**
3. Takes the block number as a **public input**
4. Queries the BAYC contract at that block to get the token owner
5. Verifies the owner matches your wallet address
6. Generates a proof without revealing private inputs

## Code Explanation

```noir
fn main(wallet_address: Address, token_id: [u8; 32], block_number: pub u64) {
    let owner = BORED_APE_YACHT_CLUB().get_owner(token_id, block_number);
    assert_eq(owner, wallet_address, "Owner is not the same as the wallet address");
}
```

- `wallet_address` - Your Ethereum address (private)
- `token_id` - The BAYC token ID you own (private)
- `block_number` - Ethereum block number to query (public)
- `BORED_APE_YACHT_CLUB()` - vlayer library function to access BAYC contract
- `get_owner()` - Retrieves the owner of the token at specified block
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
token_id = [0, 0, ..., token_id_bytes] # Your BAYC token ID
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
- That you own *some* BAYC NFT at the specified block
- The block number used for verification

**What stays private:**
- Your wallet address
- Which BAYC token you own (token ID)
- Any other holdings in your wallet

## Real-World Applications

- **BAYC Discord verification** - Prove membership without doxxing wallet
- **Exclusive events** - Verify attendance eligibility anonymously
- **Private marketplaces** - Prove you can list without revealing holdings
- **DAO voting** - Vote with BAYC weight without linking identity

## Learn More

- [BAYC Contract](https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)
- [vlayer Documentation](https://docs.vlayer.xyz)
- [Noir Language](https://noir-lang.org)
