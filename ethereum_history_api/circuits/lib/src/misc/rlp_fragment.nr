use crate::misc::fragment::Fragment;
use crate::misc::rlp_decode::STRING;
use crate::misc::types::PaddedValue;
use crate::misc::arrays::sub_array_equals_up_to_length;

struct RlpFragment<MAX_BYTES_LEN> {
    fragment: Fragment<MAX_BYTES_LEN>,
    data_type: u64 // STRING or LIST
}

impl<MAX_BYTES_LEN> RlpFragment<MAX_BYTES_LEN> {
    fn assert_string_eq<FIELD_NAME_LEN, MAX_RLP_LEN, MAX_VALUE_LEN>(
        self,
        field_name: str<FIELD_NAME_LEN>,
        rlp: [u8; MAX_RLP_LEN],
        value: PaddedValue<MAX_VALUE_LEN>
    ) {
        assert(self.data_type == STRING, f"{field_name}: Invalid RLP type");
        assert(self.fragment.length == value.length, f"{field_name}: Invalid RLP length");
        assert(
            sub_array_equals_up_to_length(value.value, rlp, self.fragment.offset, value.length), f"{field_name}: Invalid RLP value"
        );
    }
}

impl<MAX_BYTES_LEN> Default for RlpFragment<MAX_BYTES_LEN> {
    fn default() -> Self {
        RlpFragment { fragment: Fragment {offset: 0, length: 0, data: [0; MAX_BYTES_LEN]}, data_type: STRING }
    }
}

impl<MAX_BYTES_LEN> Eq for RlpFragment<MAX_BYTES_LEN> {
    fn eq(self, other: Self) -> bool {
        (self.data_type == other.data_type) & (self.fragment == other.fragment)
    }
}
