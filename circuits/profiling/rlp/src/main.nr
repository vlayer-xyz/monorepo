use dep::std;
use dep::proof::rlp;

global MAX_HEADER_RLP_SIZE = 532;
global HEADER_FIELDS_COUNT = 17;

fn main(block_header: [u8; MAX_HEADER_RLP_SIZE]) {
    let decoded: rlp::RLP_List<HEADER_FIELDS_COUNT> = rlp::decode1(block_header);
    std::println(decoded);
}
