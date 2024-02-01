// Copied from https://github.com/colinnielsen/noir-u2b as I'm getting:
// Invalid package name `noir-u2b` found in /Users/leonidlogvinov/nargo/github.com/colinnielsen/noir-u2bv0.3.0/Nargo.toml
// when trying to use it as a dependency
pub(crate) fn u64_to_u8(num: u64) -> [u8; 8] {
    let mut out: [u8; 8] = [0; 8];
    for i in 0..8 {
        out[i] = (num >> (56 - (i * 8))) as u8;
    }

    out
}

pub(crate) fn u120_to_u8(num: u120) -> [u8; 15] {
    let mut out: [u8; 15] = [0; 15];
    for i in 0..15 {
        out[i] = (num >> (112 - (i * 8))) as u8;
    }

    out
}
