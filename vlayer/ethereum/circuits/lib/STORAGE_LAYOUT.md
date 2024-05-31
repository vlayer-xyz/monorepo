# Solidity storage layout

Storage refers to smart contracts' storage that is stored as long-term memory. It allows contracts to use variables that aren't cleaned or removed after a function or transaction finish execution.

Contract storage is divided into 2<sup>256</sup> **slots** - 32 bytes each. Such a huge number of slots enables storing dynamically sized structures in an efficient way. For details read [below](#dynamically-sized-values).

## Layout

### Statically-sized values

Statically-sized values are stored one by one, starting at slot 0, in the order of their initialization in the contract. If two or more consecutive variables can fit into one slot, they are packed there together. If a variable can't fit with the previous variable, it is stored in the next slot. Variables that appear after an array or structure variables, always start a new slot. Similarly arrays and structures also always start a new storage slot.

Variables of a structure are stored just as standalone variables.

### Dynamically-sized values

Dynamically-sized values can't be stored in the same way as statically-sized values. Adding new elements to an existing dynamic array would demand values stored in succeeding slots to shift further away.  
Instead, dynamically-sized values are stored at slots chosen by keccak hashing. This is where such an enormous number of storage slots is used. It prevents data from overlapping.  
**Slot position `p`** - the starting position of a structure that is calculated based on previously appearing in contract values - is used to calculate further the positions of data.

#### Dynamic arrays

In case of dynamic arrays, position `p` contains the length of the array. Position of the first element is calculated by `keccak256(p)`. The next elements are stored just as statically-sized array's elements - one after another.

#### Mapping

Values of mapping are stored at slots: `keccak256(h(k).p)`, where `k` is a key in mapping and `h` is a function as follows: in case of value types `h` is a padding to 32 bytes, in case of strings and byte arrays `h(k) = k`.

## Employment

Understanding how contract storage works enables developer to make gas-efficient contracts.

### Less storage used

One way of saving gas is to pack variables so that contract uses less storage. To do this, one can reorder the variables' initialization in their contract.  
For example:

```
contract Contract{
    bool a = true;
    uint256 b = 0x100000;
    bool c = true;
}
```

If variables are initialized in this order, variable `b` wouldn't fit into the same slot as `a` (because `b` takes up all 32 bytes) and `c` also wouldn't fit with `b`. Because of that contract will use three slots.

If the order is changed:

```
contract Contract {
    bool a = true;
    bool c = true;
    uint256 b = 0x100000;
}
```

Now variables `a` and `c` can be packed into one slot and memory is saved since this contract uses only three slots.

### Efficient variables reading

At the same time more gas is used when variables are packed in a way, that EVM has to perform additional bitwise operations to read only one of the variables stored in one slot.  
For example: two variables - `a` and `b` - are stored in one slot. When reading variable `a`, EVM has to mask out bits of variable `b`.

Optimally it is worth packing together variables that will be also read together.
