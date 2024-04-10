use crate::transaction::TxType;

global LEGACY_TX = 0;
global ACCESS_LIST_TX = 1;
global FEE_MARKET_TX = 2;
global BLOB_TX = 3;

pub(crate) fn get_tx_fields_count(tx_type: TxType) -> u64 {
    let mut fields_count = 0;
    if tx_type == LEGACY_TX {
        fields_count = 9;
    } else if tx_type == ACCESS_LIST_TX {
        fields_count = 11;
    } else if tx_type == FEE_MARKET_TX {
        fields_count = 12;
    } else if tx_type == BLOB_TX {
        fields_count = 14;
    } else {
        assert(false, "Invalid tx type");
    }
    fields_count
}

pub(crate) fn get_nonce_index(tx_type: TxType) -> u64 {
    let mut index = 0;
    if tx_type == LEGACY_TX {
        index = 0;
    } else if tx_type == ACCESS_LIST_TX {
        index = 1;
    } else if tx_type == FEE_MARKET_TX {
        index = 1;
    } else if tx_type == BLOB_TX {
        index = 1;
    } else {
        assert(false, "Invalid tx type");
    }
    index
}

pub(crate) fn get_gas_limit_index(tx_type: TxType) -> u64 {
    let mut index = 0;
    if tx_type == LEGACY_TX {
        index = 2;
    } else if tx_type == ACCESS_LIST_TX {
        index = 3;
    } else if tx_type == FEE_MARKET_TX {
        index = 4;
    } else if tx_type == BLOB_TX {
        index = 4;
    } else {
        assert(false, "Invalid tx type");
    }
    index
}

pub(crate) fn get_signature_index(tx_type: TxType) -> u64 {
    let mut index = 0;
    if tx_type == LEGACY_TX {
        index = 6;
    } else if tx_type == ACCESS_LIST_TX {
        index = 8;
    } else if tx_type == FEE_MARKET_TX {
        index = 9;
    } else if tx_type == BLOB_TX {
        index = 11;
    } else {
        assert(false, "Invalid tx type");
    }
    index
}

pub(crate) fn get_to_index(tx_type: TxType) -> u64 {
    let mut index = 0;
    if tx_type == LEGACY_TX {
        index = 3;
    } else if tx_type == ACCESS_LIST_TX {
        index = 4;
    } else if tx_type == FEE_MARKET_TX {
        index = 5;
    } else if tx_type == BLOB_TX {
        index = 5;
    } else {
        assert(false, "Invalid tx type");
    }
    index
}
