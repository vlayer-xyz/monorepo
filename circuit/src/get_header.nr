struct BlockHeader {
  parentHash: [u8; 32],
}

#[oracle(get_header)]
unconstrained fn get_header_oracle(block_no: Field) -> BlockHeader {}

unconstrained fn get_header(block_no: Field) -> BlockHeader {
    get_header_oracle(block_no)
}

