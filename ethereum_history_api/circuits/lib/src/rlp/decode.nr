use dep::std::wrapping_sub;

/// Max number of bytes required to represent length of a string or list
global MAX_LEN_IN_BYTES: u64 = 2;

/// RLP data type enum
global STRING: u64 = 0;
global LIST: u64 = 1;

struct RlpHeader {
    offset: u64,
    length: u64, 
    data_type: u64 // STRING or LIST    
}

impl Eq for RlpHeader {
    fn eq(self, other: Self) -> bool {
        (self.offset == other.offset) & (self.length == other.length) & (self.data_type == other.data_type)
    }
}

struct RlpFragment {
    offset: u64,
    length: u64,    
    data_type: u64 // STRING or LIST
}

impl Default for RlpFragment {
    fn default() -> Self {
        RlpFragment { offset: 0, length: 0, data_type: 0 }
    }
}

impl Eq for RlpFragment {
    fn eq(self, other: Self) -> bool {
        (self.offset == other.offset) & (self.length == other.length) & (self.data_type == other.data_type)
    }
}

struct RlpList<NUM_FIELDS> {
    fragments: [RlpFragment; NUM_FIELDS],
    num_fields: u64
}

impl<N> Eq for RlpList<N> {
    fn eq(self, other: Self) -> bool {
        (self.num_fields == other.num_fields) & (self.fragments == other.fragments)
    }
}

pub fn extract_payload_len<N>(arr: [u8; N], lenlen: u64) -> u64 {
    assert(lenlen <= MAX_LEN_IN_BYTES, "Length of length exceeds maximum");

    let mut payload_length = 0;

    let mut loop_len: u64 = 0;
    if (MAX_LEN_IN_BYTES < N - 1) {
        loop_len = MAX_LEN_IN_BYTES;
    } else {
        loop_len = N - 1;
    }

    for i in 0..loop_len {
        if (i < lenlen) {
            payload_length = (arr[i + 1] as u64) + payload_length * 256;
        }
    }

    payload_length
}

pub fn decode_to_rlp_header<N>(arr: [u8; N]) -> RlpHeader {
    let prefix = arr[0];

    // (prefix < 0x80) - single byte
    let is_short_string = (prefix < 0xb8 & prefix >= 0x80); // 0-55 byte string
    let is_long_string = (prefix < 0xc0 & prefix >= 0xb8); // >55-byte string
    let is_short_list = (prefix < 0xf8 & prefix >= 0xc0); // 0-55 byte list
    let is_long_list = (prefix >= 0xf8); // >55-byte list

    let mut offset = 0;
    let mut length = 1;
    let mut data_type = STRING;

    if (is_short_string) {
        offset = 1;
        length = wrapping_sub(prefix, 0x80) as u64;
    }
    if (is_long_string) {
        offset = wrapping_sub(1 + prefix, 0xb7) as u64;
        length =  extract_payload_len(arr, wrapping_sub(prefix, 0xb7) as u64);
    }
    if (is_short_list) {
        offset = 1;
        length = wrapping_sub(prefix, 0xc0) as u64;
        data_type = LIST;
    }
    if (is_long_list) {
        offset = wrapping_sub(1 + prefix, 0xf7) as u64;
        length =  extract_payload_len(arr, wrapping_sub(prefix, 0xf7) as u64);
        data_type = LIST;
    }

    RlpHeader { offset, length, data_type }
}

pub fn decode_string<N>(input: [u8; N]) -> (u64, u64) {
    let mut RlpHeader {offset, length, data_type} = decode_to_rlp_header(input);
    assert(data_type == STRING, "Wrong data type");

    let total_len = length + offset;
    assert(total_len <= input.len(), "Length exceeds input length");

    (offset, length)
}

/// Returns an RLP list look-up table.
/// For string elements, the offset points to the payload, whereas the offset
///   of a list element points to the RLP header of that element.
pub fn decode_list<N, NUM_FIELDS>(input: [u8; N]) -> RlpList<NUM_FIELDS> {
    let mut num_fields: u64 = 0;
    let mut fragments = [RlpFragment::default(); NUM_FIELDS];

    let mut RlpHeader {offset, length, data_type} = decode_to_rlp_header(input);
    assert(data_type == LIST);

    let total_len = length + offset;
    assert(total_len <= input.len());

    for i in 0..NUM_FIELDS {
        let is_in_range = (offset != total_len) as u64;

        let header: [u8; MAX_LEN_IN_BYTES + 1] = copy_subarray(input, offset);
        let RlpHeader {offset: field_off, length: field_len, data_type: field_type} = decode_to_rlp_header(header);
        let total_field_len = field_off + field_len;

        // Assign decoded data or set them to 0 if outside od total_len
        fragments[i].offset = is_in_range * (offset + (1 - field_type) * field_off); // If the ith slot contains a list, include its RLP header.
        fragments[i].length = is_in_range * (field_len + field_type * field_off); // If the ith slot contains a list, include the length of its header.
        fragments[i].data_type = is_in_range * (field_type);

        offset += is_in_range * total_field_len;
        num_fields += is_in_range;
    }

    RlpList { fragments, num_fields }
}

/// RLP list decoder for lists of strings of length < 56 bytes.
/// Returns an RLP list look-up table.
pub fn decode_list_of_small_strings<N, NUM_FIELDS>(input: [u8; N]) -> RlpList<NUM_FIELDS> {
    let mut num_fields: u64 = 0;
    let mut fragments = [RlpFragment::default(); NUM_FIELDS];

    let mut RlpHeader {offset, length: payload_len, data_type: input_type} = decode_to_rlp_header(input);
    let total_len = payload_len + offset;

    assert(input_type == LIST);
    assert(total_len <= input.len());

    for i in 0..NUM_FIELDS {
        let loop_ind = (offset != total_len) as u64;

        let header = input[offset];

        assert(header < 0xb8); // Header must represent a string of length < 56 bytes.

        let field_type = STRING;

        let single_byte_ind = (header < 0x80) as u64; // 1 if `header` represents a single byte.

        let field_off = 1 - single_byte_ind; // If `header` < 0x80, then we are dealing with a single byte whose value
        // is given by header. Else, the string begins at the following index.

        let field_len = single_byte_ind * 1 + (1 - single_byte_ind) * (wrapping_sub(header, 0x80) as u64); // Single byte means len = 1,
        // else subtract 0x80 from the header to determine len.

        let total_field_len = field_off + field_len;

        fragments[i].offset = loop_ind * (offset + field_off);
        fragments[i].length = loop_ind * (field_len);
        fragments[i].data_type= loop_ind * (field_type);

        offset += loop_ind * total_field_len;
        num_fields += loop_ind;
    }

    assert(total_len == offset);

    RlpList { fragments, num_fields }
}

pub fn copy_subarray<T, N, M>(arr: [T; N], offset: u64) -> [T; M] {
    let mut out = [dep::std::unsafe::zeroed(); M];

    for i in 0..M {
        let j = (((offset + i) as u64) < N) as u64 * (offset + i); // Restrict to proper range and fill with arr[0] otherwise.
        out[i] = arr[j];
    }

    out
}

// Leads to fewer constraints than the usual if.
pub fn strict_if(pred: bool, x: u64, y: u64) -> u64 {
    let pred_f = pred as u64;
    pred_f * x + (1 - pred_f) * y
}
