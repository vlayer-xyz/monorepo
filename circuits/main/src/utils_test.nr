use crate::utils::{u64_to_u8, u120_to_u8};

#[test]
fn test_u64() {
    let small = u64_to_u8(10);
    assert(small.len() == 8);
    assert(small[0] == 0);
    assert(small[1] == 0);
    assert(small[2] == 0);
    assert(small[3] == 0);
    assert(small[4] == 0);
    assert(small[5] == 0);
    assert(small[6] == 0);
    assert(small[7] == 10);

    let two_byte = u64_to_u8(256);
    assert(two_byte[0] == 0x00);
    assert(two_byte[1] == 0x00);
    assert(two_byte[2] == 0x00);
    assert(two_byte[3] == 0x00);
    assert(two_byte[4] == 0x00);
    assert(two_byte[5] == 0x00);
    assert(two_byte[6] == 0x01);
    assert(two_byte[7] == 0x00);

    let random = u64_to_u8(0x1cbe443030);
    assert(random[0] == 0x00);
    assert(random[1] == 0x00);
    assert(random[2] == 0x00);
    assert(random[3] == 0x1c);
    assert(random[4] == 0xbe);
    assert(random[5] == 0x44);
    assert(random[6] == 0x30);
    assert(random[7] == 0x30);

    let ceil = u64_to_u8(18446744073709551615);
    assert(ceil[0] == 0xff);
    assert(ceil[1] == 0xff);
    assert(ceil[2] == 0xff);
    assert(ceil[3] == 0xff);
    assert(ceil[4] == 0xff);
    assert(ceil[5] == 0xff);
    assert(ceil[6] == 0xff);
    assert(ceil[7] == 0xff);
}


#[test]
fn test_u120() {
    let small = u120_to_u8(10);
    assert(small.len() == 15);
    assert(small[0] == 0);
    assert(small[1] == 0);
    assert(small[2] == 0);
    assert(small[3] == 0);
    assert(small[4] == 0);
    assert(small[5] == 0);
    assert(small[6] == 0);
    assert(small[7] == 0);
    assert(small[8] == 0);
    assert(small[9] == 0);
    assert(small[10] == 0);
    assert(small[11] == 0);
    assert(small[12] == 0);
    assert(small[13] == 0);
    assert(small[14] == 10);

    let two_byte = u120_to_u8(256);
    assert(two_byte[0] == 0x00);
    assert(two_byte[1] == 0x00);
    assert(two_byte[2] == 0x00);
    assert(two_byte[3] == 0x00);
    assert(two_byte[4] == 0x00);
    assert(two_byte[5] == 0x00);
    assert(two_byte[6] == 0x00);
    assert(two_byte[7] == 0x00);
    assert(two_byte[8] == 0x00);
    assert(two_byte[9] == 0x00);
    assert(two_byte[10] == 0x00);
    assert(two_byte[11] == 0x00);
    assert(two_byte[12] == 0x00);
    assert(two_byte[13] == 0x01);
    assert(two_byte[14] == 0x00);

    let ceil = u120_to_u8(1329227995784915872903807060280344575);
    assert(ceil[0] == 0xff);
    assert(ceil[1] == 0xff);
    assert(ceil[2] == 0xff);
    assert(ceil[3] == 0xff);
    assert(ceil[4] == 0xff);
    assert(ceil[5] == 0xff);
    assert(ceil[6] == 0xff);
    assert(ceil[7] == 0xff);
    assert(ceil[8] == 0xff);
    assert(ceil[9] == 0xff);
    assert(ceil[10] == 0xff);
    assert(ceil[11] == 0xff);
    assert(ceil[12] == 0xff);
    assert(ceil[13] == 0xff);
    assert(ceil[14] == 0xff);
}
