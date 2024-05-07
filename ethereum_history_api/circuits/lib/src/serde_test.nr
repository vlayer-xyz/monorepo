mod u128_serialize {

    use crate::serde::U128_SERIALIZED_LEN;

    #[test]
    fn simple() {
        let value = U128::from_integer(100);
        let serialized: [Field; U128_SERIALIZED_LEN] = value.serialize();

        assert_eq(serialized[0], value.lo);
        assert_eq(serialized[1], value.hi);
    }
}
