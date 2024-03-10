use dep::u2b::u64_to_u8;

pub fn u128_to_u8(num: U128) -> [u8; 16] {
    let mut out: [u8; 16] = [0; 16];
    let high = u64_to_u8(num.hi as u64);
    let low = u64_to_u8(num.lo as u64);
    for i in 0..8 {
        out[i] = high[i];
    }
    for i in 0..8 {
        out[i + 8] = low[i];
    }

    out
}
