use crate::misc::arrays::memcpy_up_to_length;

struct Fragment<MAX_DATA_LEN> {
    offset: u64,
    length: u64,
    data: [u8; MAX_DATA_LEN]
}

impl<MAX_DATA_LEN> Fragment<MAX_DATA_LEN> {
    pub fn new(offset: u64, length: u64, data: [u8; MAX_DATA_LEN]) -> Fragment<MAX_DATA_LEN> {
        assert(offset + length <= data.len() as u64, "Fragment length exceeds data length");

        Fragment { offset, length, data }
    }

    pub fn new_with_length(length: u64, data: [u8; MAX_DATA_LEN]) -> Fragment<MAX_DATA_LEN> {
        assert(length <= data.len() as u64, "Fragment length exceeds data length");

        Fragment { offset: 0, length, data }
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

    pub fn is_empty(self) -> bool {
         self.length == 0
     }

    pub fn at(self, index: u64) -> u8 {
        let length = self.length;
        assert(index < self.length, f"Index out of bounds, tried to access index {index} but the length is {length}");

        self.data[self.offset + index]
    }

    pub fn set(&mut self, index: u64, value: u8) {
        let length = self.length;
        assert(index < self.length, f"Index out of bounds, tried to set at index {index} but the length is {length}");

        self.data[self.offset + index] = value;
    }

    pub fn pop_front(&mut self) -> u8 {
         assert(!self.is_empty(), "Cannot pop from an empty slice");
         self.offset += 1;
         self.length -= 1;
         self.data[self.offset - 1]
     }
}

impl<MAX_DATA_LEN> Eq for Fragment<MAX_DATA_LEN> {
    fn eq(self, other: Fragment<MAX_DATA_LEN>) -> bool {
        let mut res = true;
        if self.length != other.length {
            res = false;
        } else {
            for i in 0..MAX_DATA_LEN {
                if i < self.length {
                    res &= self.at(i) == other.at(i);
                }
            }
        }

        res
    }
}
