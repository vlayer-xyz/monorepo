use dep::std;

fn main(x: Field) {
    let hash = std::hash::poseidon::bn254::hash_1([x]);
    std::println(f"hash = {hash}");
    assert(hash == 0x1b408dafebeddf0871388399b1e53bd065fd70f18580be5cdde15d7eb2c52743);
}
