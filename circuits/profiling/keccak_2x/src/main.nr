use dep::std;

fn main(x: u8) {
    let array: [u8; 1000] = [x; 1000];
    let hash = std::hash::keccak256(array, 1000);
    let hash2 = std::hash::keccak256(array, 999);
    std::println(f"hash = {hash}");
    std::println(f"hash2 = {hash2}");
    assert(hash[0] == 174);
    assert(hash2[0] == 10);
}
