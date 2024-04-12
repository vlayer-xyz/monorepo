use crate::misc::arrays::memcpy_up_to_length;
use crate::misc::iterable::Iterable;

struct Fragment<MAX_DATA_LEN> { // Slice
	offset: u64,
	length: u64,
	data: [u8; MAX_DATA_LEN]
}

impl<MAX_DATA_LEN> Fragment<MAX_DATA_LEN> {
    pub fn new(offset: u64, length: u64, data: [u8; MAX_DATA_LEN]) -> Fragment<MAX_DATA_LEN> {
        assert(offset + length <= data.len() as u64, "Fragment data exceeds data length");

        Fragment { offset, length, data }
    }

    pub fn new_focused(data: [u8; MAX_DATA_LEN]) -> Fragment<MAX_DATA_LEN> {
        Fragment { offset: 0, length: data.len() as u64, data }
    }

    pub fn focus<NEW_MAX_LEN>(self) -> Fragment<NEW_MAX_LEN> {
        assert(NEW_MAX_LEN >= self.length, "New max length is smaller than fragment length");

        let mut new_data: [u8; NEW_MAX_LEN] = [0; NEW_MAX_LEN];
        memcpy_up_to_length(&mut new_data, self.data, self.offset, self.length);

        Fragment { offset: 0, length: self.length, data: new_data }
    }
}

impl<Env, MAX_DATA_LEN> Iterable<Env, u8> for Fragment<MAX_DATA_LEN> {
	fn each(self, callback: fn[Env](u8) -> ()) -> () {
		for i in 0..MAX_DATA_LEN {
			if i < self.length {
				callback(self.data[i])
			}
		}
	}
}
