use crate::misc::fragment::Fragment;

pub fn byte_to_nibbles(byte: u8) -> (u8, u8) {
    let upper = byte / 16;
    let lower = byte - 16 * upper;

    (upper, lower)
}

pub fn bytes_to_nibbles<MAX_NIBBLE_LEN>(bytes: Fragment<MAX_NIBBLE_LEN>) -> Fragment<MAX_NIBBLE_LEN> {
    assert(
        MAX_NIBBLE_LEN >= 2 * bytes.length, "Bytes implicit data length must be at least 2 times larger than bytes explicit length"
    );

    let mut nibbles = Fragment::new_focused([0; MAX_NIBBLE_LEN]);
    for i in 0..bytes.length {
        let (hi, lo) = byte_to_nibbles(bytes.at(i));

        nibbles.set(2 * i, hi);
        nibbles.set(2 * i + 1, lo);
    }

    nibbles
}

pub fn nibbles_to_byte(upper: u8, lower: u8) -> u8 {
    assert(upper < 16, "Nibble value must be less than 16");
    assert(lower < 16, "Nibble value must be less than 16");

    upper * 16 + lower
}

pub fn nibbles_to_bytes<BYTES_LEN, NIB_LEN>(nibbles: [u8; NIB_LEN]) -> [u8; BYTES_LEN] {
    assert(NIB_LEN == 2 * BYTES_LEN, "Generic arguments don't match");

    let mut bytes = [0; BYTES_LEN];

    for i in 0..NIB_LEN / 2 {
        let byte = nibbles_to_byte(nibbles[2 * i], nibbles[2 * i + 1]);
        bytes[i] = byte;
    }

    bytes
}

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

/// Left-shift for byte arrays
/// Returns an appropriately shifted byte array.
///
/// # Arguments
/// * `input` - Byte array
/// * `n` - Amount to left-shift elements by
///
/// # Quirks
/// The empty slots are set to 0.
pub(crate) fn left_byte_shift<N>(input: [u8; N], n: u64) -> [u8; N] {
    let mut out = [0; N];

    for i in 0..N {
        // Restrict indices to be shifted, i.e. ∀i: i+n < N, out[i] ← input[i+n].
        let index_ind = (((i + n) as u32) < (N as u32)) as u64;
        out[i] = (index_ind as u8) * input[index_ind * (i + n)];
    }

    out
}

/// Function for expressing a big-endian byte array as a right-padded one.
/// Returns a right-padded byte array together with the actual byte length of the number.
///
/// # Arguments
/// * `in_value` - Byte array representing a number in big-endian form.
pub(crate) fn byte_value<N>(in_value: [u8; N]) -> ([u8; N], u64) {
    let mut value_length = 0;

    for i in 0..N {
        let num_bytes_ind = (value_length == 0) as u64;
        let byte_ind = (in_value[i] != 0) as u64;
        value_length = num_bytes_ind*byte_ind * (N - i) + (1 - num_bytes_ind) * value_length;
    }

    let value = left_byte_shift(in_value, N - value_length);

    (value, value_length)
}
