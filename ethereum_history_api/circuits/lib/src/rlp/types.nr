use crate::misc::{arrays::sub_array_equals_up_to_length};
use crate::rlp::decode::STRING;
use crate::misc::bytes::byte_value;
use dep::u2b::{u64_to_u8, u32_to_u8};
use crate::misc::types::{Bytes32, BYTES32_LENGTH, Address, ADDRESS_LENGTH};

type RlpList<MAX_FIELDS> = BoundedVec<RlpFragment, MAX_FIELDS>;

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

impl RlpFragment {
    fn assert_eq_bytes<FIELD_NAME_LEN, MAX_RLP_LEN, MAX_VALUE_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: [u8; MAX_VALUE_LEN],
        length: u64
    ) {
        assert(self.data_type == STRING, f"{field_name}: Invalid RLP type");
        assert(self.length == length, f"{field_name}: Invalid RLP length");
        assert(
            sub_array_equals_up_to_length(value, rlp, self.offset, self.length), f"{field_name}: Invalid RLP value"
        );
    }

    fn assert_eq_bounded_vec<FIELD_NAME_LEN, MAX_RLP_LEN, MAX_VALUE_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: BoundedVec<u8, MAX_VALUE_LEN>
    ) {
        self.assert_eq_bytes(field_name, rlp, value.storage, value.len);
    }

    fn assert_empty_string<FIELD_NAME_LEN, MAX_RLP_LEN>(self, field_name: str<FIELD_NAME_LEN>) {
        assert(self.data_type == STRING, f"{field_name}: Invalid RLP type");
        assert(self.length == 0, f"{field_name}: Expected empty string");
    }

    fn assert_eq_u1<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: u1
    ) {
        self.assert_eq_bytes(field_name, rlp, [value as u8], 1);
    }

    fn assert_eq_u8<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: u8
    ) {
        self.assert_eq_bounded_vec(field_name, rlp, byte_value([value]));
    }

    fn assert_eq_u32<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: u32
    ) {
        self.assert_eq_bounded_vec(field_name, rlp, byte_value(u32_to_u8(value)));
    }

    fn assert_eq_u64<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: u64
    ) {
        self.assert_eq_bounded_vec(field_name, rlp, byte_value(u64_to_u8(value)));
    }

    fn assert_eq_u128<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: U128
    ) {
        self.assert_eq_bounded_vec(field_name, rlp, byte_value(value.to_be_bytes()));
    }

    fn assert_eq_address<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: Address
    ) {
        self.assert_eq_bytes(field_name, rlp, value, ADDRESS_LENGTH);
    }

    fn assert_eq_bytes32<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: Bytes32
    ) {
        self.assert_eq_bytes(field_name, rlp, value, BYTES32_LENGTH);
    }
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
