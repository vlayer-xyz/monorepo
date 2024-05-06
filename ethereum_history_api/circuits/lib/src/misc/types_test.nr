mod bytes32_serialize {
    use crate::misc::types::Bytes32;

    #[test]
    fn success() {
        let bytes: Bytes32 = [1; 32];
        let serialized: [Field; 32] = bytes.serialize();
        let expected: [Field; 32] = [1; 32];
        assert_eq(serialized, expected);
    }
}
