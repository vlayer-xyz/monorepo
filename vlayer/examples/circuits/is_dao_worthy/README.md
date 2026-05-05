# DAO Eligibility Proof (USDC Balance)

Prove you hold at least $100k USDC without revealing your exact balance or wallet address.

## Overview

This circuit generates a zero-knowledge proof that verifies you meet a minimum USDC balance requirement for DAO participation, while keeping your exact balance and wallet address private.

## Use Cases

- **DAO membership verification** - Prove financial eligibility without exposing wealth
- **Anonymous voting power** - Participate in governance without revealing holdings
- **Private compliance** - Meet regulatory requirements without data exposure
- **Gated access** - Unlock features based on balance without showing exact amount

## How It Works

The circuit:

1. Takes your wallet address as a **private input**
2. Takes the block number as a **public input**
3. Queries your USDC balance at that block using vlayer's token library
4. Verifies your balance is >= $100k USDC (100,000,000,000 base units)
5. Generates a proof without revealing your exact balance or address

## Code Explanation

```noir
global MIN_BALANCE = U128::from_integer(100_000_000_000); // $100k

fn main(wallet_address: Address, block_number: pub u64) {
    let wallet_balance = USDC.get_balance(wallet_address, block_number, false);
    let is_balance_greater_or_equal = MIN_BALANCE <= wallet_balance;
    assert(is_balance_greater_or_equal, "Insufficient USDC balance");
}
```

- `MIN_BALANCE` - Minimum required balance (100,000 USDC with 6 decimals)
- `wallet_address` - Your Ethereum address (private)
- `block_number` - Ethereum block number to query (public)
- `USDC.get_balance()` - Retrieves USDC balance at specified block
- `false` parameter - Non-recursive proof generation
- `assert()` - Proves balance meets minimum requirement

## Running This Example

### Compile the circuit

```bash
nargo compile
```

### Configure your inputs

Edit `Prover.toml` with your values:

```toml
wallet_address = "0x..." # Your wallet address
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
- That you hold *at least* $100k USDC at the specified block
- The block number used for verification

**What stays private:**
- Your wallet address
- Your exact USDC balance
- Whether you hold more than the minimum
- Any other token holdings

## Real-World Applications

- **Investment DAOs** - Prove accredited investor status anonymously
- **Governance participation** - Vote with verified stake without revealing identity
- **Private lending** - Prove creditworthiness without exposing full portfolio
- **Exclusive memberships** - Access high-net-worth communities privately

## Understanding the Balance

The minimum balance is set to 100,000,000,000 base units which equals:
- **100,000 USDC** (USDC has 6 decimal places)
- **$100,000 USD** equivalent

You can modify `MIN_BALANCE` in the code for different thresholds.

## Learn More

- [USDC Contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48)
- [vlayer Documentation](https://docs.vlayer.xyz)
- [Noir Language](https://noir-lang.org)
