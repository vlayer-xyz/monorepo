use dep::proof::utils::byte_value;

pub fn right_pad<N>(arr: [u8; N]) -> ([u8; N], u64) {
    byte_value(arr)
}

pub fn left_to_right_padding<N>(nibbles: [u8; N]) -> ([u8; N], u64) {
    let (mut shifted, mut len) = right_pad(nibbles);
    if (len % 2 == 1) {
        shift_right_by_one(&mut shifted);
        len += 1;
    }

    let shifted_by = N - len;
    (shifted, shifted_by)
}

pub fn shift_right_by_one<N>(arr: &mut [u8; N]) {
    assert(arr[N - 1] == 0, "Last element must be zero to shift the array right by one");

    let mut last = 0;
    for i in 0..N {
        let tmp = (*arr)[i];
        (*arr)[i] = last;
        last = tmp;
    }
}

pub fn nibbles_to_byte(upper: u8, lower: u8) -> u8 {
    assert(upper < 16, "Nibble value must be less than 16");
    assert(lower < 16, "Nibble value must be less than 16");

    upper * 16 + lower
}

pub fn nibbles_to_bytes<BYTES_LEN, NIB_LEN>(nibbles: [u8; NIB_LEN]) -> [u8; BYTES_LEN] {
    assert(NIB_LEN == 2 * BYTES_LEN);

    let mut bytes = [0; BYTES_LEN];

    for i in 0..NIB_LEN / 2 {
        let byte = nibbles_to_byte(nibbles[2 * i], nibbles[2 * i + 1]);
        bytes[i] = byte;
    }

    bytes
}
