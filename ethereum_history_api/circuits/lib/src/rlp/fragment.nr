use crate::misc::{arrays::sub_array_equals_up_to_length, types::PaddedValue};
use crate::rlp::decode::STRING;

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
        value: PaddedValue<MAX_VALUE_LEN>
    ) {
        assert(self.data_type == STRING, f"{field_name}: Invalid RLP type");
        assert(self.length == value.length, f"{field_name}: Invalid RLP length");
        assert(
            sub_array_equals_up_to_length(value.value, rlp, self.offset, value.length), f"{field_name}: Invalid RLP value"
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
