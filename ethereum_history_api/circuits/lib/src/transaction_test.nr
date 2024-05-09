use crate::transaction::{TxPartial, ForeignCallTransaction};
use dep::std::unsafe::zeroed;
use crate::misc::bounded_vecs::bounded_vec_from_array;

global data_length = 8;

#[test]
fn into_foreign_transaction_test() {
    let transaction: TxPartial<data_length> = TxPartial {
        nonce: 0,
        gas_limit: 0,
        to: Option::none(),
        value: U128::from_integer(0),
        data: bounded_vec_from_array([1, 2, 3, 4, 5]),
        v: 0,
        r: zeroed(),
        s: zeroed()
    };
    let foreign_transaction: ForeignCallTransaction<data_length> = transaction.into();

    assert_eq(foreign_transaction.data, [1, 2, 3, 4, 5, 0, 0, 0]);
    assert_eq(foreign_transaction.data_len, 5);
}
