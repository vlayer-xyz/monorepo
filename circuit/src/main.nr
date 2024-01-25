use dep::std;

fn main(x: [u8; 1000]) {
    let x1 = std::hash::keccak256(x, 1000);
    let x2 = std::hash::keccak256(x, 999);
    let x3 = std::hash::keccak256(x, 998);
    let x4 = std::hash::keccak256(x, 997);
    let mut sum: u8 = 0;
    for i in 0..32 {
        sum = std::wrapping_add(x1[i], sum);
        sum = std::wrapping_add(x2[i], sum);
        sum = std::wrapping_add(x3[i], sum);
        sum = std::wrapping_add(x4[i], sum);
    }
    std::println(sum);
    assert(sum == 136);
}
