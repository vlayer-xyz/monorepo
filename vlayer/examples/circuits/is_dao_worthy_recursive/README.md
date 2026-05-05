# DAO Eligibility Proof - Recursive (USDC Balance)

Prove you hold at least $100k USDC using recursive proof composition for better efficiency.

## Overview

This circuit is functionally identical to `is_dao_worthy` but uses recursive proof composition, which can improve proof generation efficiency and reduce verification costs for complex scenarios.

## Use Cases

Same as `is_dao_worthy`, but with optimized proof generation:

- **DAO membership verification** - Prove financial eligibility with better performance
- **Anonymous voting power** - Participate in governance with optimized proofs
- **Private compliance** - Meet requirements with efficient verification
- **Gated access** - Unlock features using recursive proof composition

## How It Works

The circuit:

1. Takes your wallet address as a **private input**
2. Takes the block number as a **public input**
3. Queries your USDC balance at that block using **recursive proof mode**
4. Verifies your balance is >= $100k USDC (100,000,000,000 base units)
5. Generates a recursive proof for better efficiency

## Code Explanation

```noir
global MIN_BALANCE = U128::from_integer(100_000_000_000); // $100k

fn main(wallet_address: Address, block_number: pub u64) {
    let wallet_balance = USDC.get_balance(wallet_address, block_number, true);
    assert(MIN_BALANCE <= wallet_balance, "Insufficient USDC balance");
}
```

**Key difference from is_dao_worthy:**
- `true` parameter - Enables **recursive proof composition**
- More efficient for complex proof scenarios
- Can reduce on-chain verification costs

## Recursive Proofs Explained

Recursive proofs allow you to:

- **Compose multiple proofs** into a single proof
- **Reduce verification complexity** on-chain
- **Optimize proof generation** for complex queries
- **Enable proof aggregation** for batch verification

This is particularly useful when combining multiple balance checks or building more complex eligibility criteria.

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

## When to Use Recursive vs Non-Recursive

**Use `is_dao_worthy` (non-recursive) when:**
- Simple single balance check
- Minimal proof composition needed
- Straightforward verification

**Use `is_dao_worthy_recursive` (this example) when:**
- Combining multiple proofs
- Building complex eligibility logic
- Optimizing on-chain verification costs
- Aggregating proofs for batch processing

## Real-World Applications

- **Multi-criteria DAOs** - Combine balance proof with other eligibility checks
- **Tiered membership** - Aggregate proofs for different membership levels
- **Cross-chain verification** - Compose proofs from multiple chains
- **Batch governance** - Verify multiple voters efficiently

## Learn More

- [USDC Contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48)
- [vlayer Documentation](https://docs.vlayer.xyz)
- [Noir Recursion](https://noir-lang.org/docs/how_to/recursion)
