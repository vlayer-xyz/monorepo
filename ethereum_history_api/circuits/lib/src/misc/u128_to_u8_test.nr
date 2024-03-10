use crate::misc::u128_to_u8::{u128_to_u8};

#[test]
fn test_u128() {
    let high = 1;
    let low = 2;
    let random = u128_to_u8(U128::from_u64s_be(high, low));
    assert(random.len() == 16);
    assert(random[0] == 0x00);
    assert(random[7] == 0x01);
    assert(random[15] == 0x02);
}
