use dep::ethereum_history_api::header::MAX_HEADER_RLP_LEN;
use dep::ethereum_history_api::verifiers::header::MAX_HEADER_FIELDS_COUNT;
use dep::ethereum_history_api::fixtures::mainnet::{
    london::crypto_punks::header::{block_header_partial as london_block_header_partial, block_header_rlp as london_block_header_rlp},
    frontier::first::header::{
    block_header_partial as frontier_first_block_header_partial,
    block_header_rlp as frontier_first_block_header_rlp
}
};
use dep::ethereum_history_api::rlp::decode::{RlpList, RlpHeader, decode_to_rlp_header, LIST, copy_subarray, RlpFragment, Fragment};

//Using fragment without data field 2.60s user 0.13s system 497% cpu 0.547 total
struct FragmentRestrained {
    offset: u64,
    length: u64
}

pub fn set_fragment_restrained<M>() -> BoundedVec<FragmentRestrained, M> {
    let mut result = BoundedVec::new();
    let mut counter = 0;

    for _ in 0..M {
        if (counter < M) {
            let tmp = FragmentRestrained { offset: 1, length: 1 };
            result.push(tmp);
            counter +=1;
        }
    }

    result
}

#[test]
fn test_restrained_20() {
    let _: BoundedVec<FragmentRestrained, 20> = set_fragment_restrained();
}

//Using bounded vec's length as if condition 10.64s user 0.61s system 123% cpu 9.074 total
pub fn set_fragment_vec_len<N, M>() -> BoundedVec<Fragment<500>, M> {
    let mut result = BoundedVec::new();

    for _ in 0..M {
        if (result.len() < M) {
            let tmp = Fragment { offset: 1, length: 1, data: [0; 500] };
            result.push(tmp);
        }
    }

    result
}

#[test]
fn test_vec_len() {
    let _: BoundedVec<Fragment<500>, 20> = set_fragment_vec_len();
}

//Using constant parameter as if condition  2.69s user 0.13s system 482% cpu 0.586 total
pub fn set_fragment_const<N, M>() -> BoundedVec<Fragment<500>, M> {
    let mut result = BoundedVec::new();
    let a = 5;

    for _ in 0..M {
        if (a < M) {
            let tmp = Fragment { offset: 1, length: 1, data: [0; 500] };
            result.push(tmp);
        }
    }

    result
}

#[test]
fn test_const() {
    let _: BoundedVec<Fragment<500>, 20> = set_fragment_const();
}

//Normal 10.76s user 0.47s system 125% cpu 8.981 total
pub fn set_fragment<N, M>() -> BoundedVec<Fragment<500>, M> {
    let mut result = BoundedVec::new();
    let mut counter = 0;

    for _ in 0..M {
        if (counter < M) {
            let tmp = Fragment { offset: 1, length: 1, data: [0; 500] };
            result.push(tmp);
            counter +=1;
        }
    }

    result
}

#[test]
fn test_set_fragment_0() {
    let _: BoundedVec<Fragment<500>, 0> = set_fragment();
}

#[test]
fn test_set_fragment_1() {
    let _: BoundedVec<Fragment<500>, 1> = set_fragment();
}

#[test]
fn test_set_fragment_2() {
    let _: BoundedVec<Fragment<500>, 2> = set_fragment();
}

#[test]
fn test_set_fragment_3() {
    let _: BoundedVec<Fragment<500>, 3> = set_fragment();
}

#[test]
fn test_set_fragment_4() {
    let _: BoundedVec<Fragment<500>, 4> = set_fragment();
}

#[test]
fn test_set_fragment_5() {
    let _: BoundedVec<Fragment<500>, 5> = set_fragment();
}

#[test]
fn test_set_fragment_6() {
    let _: BoundedVec<Fragment<500>, 6> = set_fragment();
}

#[test]
fn test_set_fragment_7() {
    let _: BoundedVec<Fragment<500>, 7> = set_fragment();
}

#[test]
fn test_set_fragment_8() {
    let _: BoundedVec<Fragment<500>, 8> = set_fragment();
}

#[test]
fn test_set_fragment_9() {
    let _: BoundedVec<Fragment<500>, 9> = set_fragment();
}

#[test]
fn test_set_fragment_10() {
    let _: BoundedVec<Fragment<500>, 10> = set_fragment();
}

#[test]
fn test_set_fragment_11() {
    let _: BoundedVec<Fragment<500>, 11> = set_fragment();
}

#[test]
fn test_set_fragment_12() {
    let _: BoundedVec<Fragment<500>, 12> = set_fragment();
}

#[test]
fn test_set_fragment_13() {
    let _: BoundedVec<Fragment<500>, 13> = set_fragment();
}

#[test]
fn test_set_fragment_14() {
    let _: BoundedVec<Fragment<500>, 14> = set_fragment();
}

#[test]
fn test_set_fragment_15() {
    let _: BoundedVec<Fragment<500>, 15> = set_fragment();
}

#[test]
fn test_set_fragment_16() {
    let _: BoundedVec<Fragment<500>, 16> = set_fragment();
}

#[test]
fn test_set_fragment_17() {
    let _: BoundedVec<Fragment<500>, 17> = set_fragment();
}

#[test]
fn test_set_fragment_18() {
    let _: BoundedVec<Fragment<500>, 18> = set_fragment();
}

#[test]
fn test_set_fragment_19() {
    let _: BoundedVec<Fragment<500>, 19> = set_fragment();
}

#[test]
fn test_set_fragment_20() {
    let _: BoundedVec<Fragment<500>, 20> = set_fragment();
}

#[test]
fn test_set_fragment_40() {
    let _: BoundedVec<Fragment<500>, 40> = set_fragment();
}
