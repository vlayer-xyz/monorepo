pub fn nibbles_to_byte(upper: u8, lower: u8) -> u8 {
    assert(upper < 16, "Nibble value must be less than 16");
    assert(lower < 16, "Nibble value must be less than 16");

    (upper << 4) | lower
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

pub fn bytes_to_field<BYTES_LEN>(bytes: [u8; BYTES_LEN], offset: u64, len: u64) -> Field {
    let mut field: u64 = 0;
    for i in 0..len {
        field <<= 8;
        field |= bytes[offset + i] as u64;
    }

    field as Field
}
