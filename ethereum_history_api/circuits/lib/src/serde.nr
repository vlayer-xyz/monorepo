trait Serialize<LEN> {
    fn serialize(self) -> [Field; LEN];
}
