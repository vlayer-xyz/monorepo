use crate::misc::{arrays::sub_array_equals_up_to_length};
use crate::rlp::decode::STRING;
use crate::misc::bytes::byte_value;
use dep::u2b::u64_to_u8;
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
    fn assert_string_eq<FIELD_NAME_LEN, MAX_RLP_LEN, MAX_VALUE_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: BoundedVec<u8, MAX_VALUE_LEN>
    ) {
        assert(self.data_type == STRING, f"{field_name}: Invalid RLP type");
        assert(self.length == value.len, f"{field_name}: Invalid RLP length");
        assert(
            sub_array_equals_up_to_length(value.storage, rlp, self.offset, value.len), f"{field_name}: Invalid RLP value"
        );
    }

    fn assert_u64_eq<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: u64
    ) {
        self.assert_string_eq(field_name, rlp, byte_value(u64_to_u8(value)));
    }

    fn assert_bytes32_eq<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: Bytes32
    ) {
        self.assert_string_eq(
            field_name,
            rlp,
            BoundedVec { storage: value, len: BYTES32_LENGTH }
        );
    }

    fn assert_address_eq<FIELD_NAME_LEN, MAX_RLP_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: Address
    ) {
        self.assert_string_eq(
            field_name,
            rlp,
            BoundedVec { storage: value, len: ADDRESS_LENGTH }
        );
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
