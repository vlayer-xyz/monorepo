use crate::misc::arrays::{memcpy_up_to_length, resize};
use dep::std::unsafe::zeroed;

struct Fragment<MAX_DATA_LEN, T> {
    offset: u64,
    length: u64,
    data: [T; MAX_DATA_LEN]
}

impl<MAX_DATA_LEN, T> Fragment<MAX_DATA_LEN, T> {
    pub fn empty() -> Fragment<MAX_DATA_LEN, T> {
        Fragment { offset: 0, length: 0, data: zeroed() }
    }

    pub fn new(offset: u64, length: u64, data: [T; MAX_DATA_LEN]) -> Fragment<MAX_DATA_LEN, T> {
        assert(offset + length <= data.len() as u64, "Fragment length exceeds data length");

        Fragment { offset, length, data }
    }

    pub fn new_with_length(length: u64, data: [T; MAX_DATA_LEN]) -> Fragment<MAX_DATA_LEN, T> {
        assert(length <= data.len() as u64, "Fragment length exceeds data length");

        Fragment { offset: 0, length, data }
    }

    pub fn from_array<DATA_LEN>(data: [T; DATA_LEN]) -> Fragment<DATA_LEN, T> {
        Fragment { offset: 0, length: data.len() as u64, data }
    }

    pub fn from_array_resize<DATA_LEN>(data: [T; DATA_LEN]) -> Fragment<MAX_DATA_LEN, T> {
        Fragment { offset: 0, length: data.len() as u64, data: resize(data) }
    }

    pub fn to_array<NEW_MAX_LEN>(self) -> [T; NEW_MAX_LEN] {
        self.focus().data
    }

    pub fn from_vec(vec: BoundedVec<T, MAX_DATA_LEN>) -> Fragment<MAX_DATA_LEN, T> {
        Fragment::new_with_length(vec.len, vec.storage)
    }

    pub fn focus<NEW_MAX_LEN>(self) -> Fragment<NEW_MAX_LEN, T> {
        assert(NEW_MAX_LEN >= self.length, "New max length is smaller than fragment length");

        let mut new_data: [T; NEW_MAX_LEN] = zeroed();
        memcpy_up_to_length(&mut new_data, self.data, self.offset, self.length);

        Fragment { offset: 0, length: self.length, data: new_data }
    }

    pub fn subfragment(self, offset: u64, length: u64) -> Fragment<MAX_DATA_LEN, T> {
        assert(offset + length <= self.length, "Subfragment overflows fragment");

        Fragment { offset: self.offset + offset, length, data: self.data }
    }

    pub fn is_empty(self) -> bool {
        self.length == 0
    }

    pub fn at(self, index: u64) -> T {
        let length = self.length;
        assert(
            index < self.length, f"Index out of bounds, tried to access index {index} but the length is {length}"
        );

        self.data[self.offset + index]
    }

    pub fn set(&mut self, index: u64, value: T) {
        let length = self.length;
        assert(
            index < self.length, f"Index out of bounds, tried to set at index {index} but the length is {length}"
        );

        self.data[self.offset + index] = value;
    }

    pub fn pop_front(&mut self) -> T {
        assert(!self.is_empty(), "Cannot pop from an empty fragment");
        self.offset += 1;
        self.length -= 1;
        self.data[self.offset - 1]
    }

    pub fn pop_front_array<LEN>(&mut self) -> [T; LEN] {
        assert(self.length >= LEN as u64, "Cannot pop array: fragment is too short");
        let mut res: [T; LEN] = zeroed();
        res.map(|_| self.pop_front())
    }

    pub fn push_back(&mut self, value: T) {
        assert(self.offset + self.length + 1 <= MAX_DATA_LEN, "Cannot push: fragment is full");
        self.data[self.offset + self.length] = value;
        self.length += 1;
    }

    pub fn extend_back<LEN>(&mut self, other: [T; LEN]) {
        for i in 0..LEN {
            self.push_back(other[i]);
        }
    }
}

impl<MAX_DATA_LEN, T> Eq for Fragment<MAX_DATA_LEN, T> where T: Eq {
    fn eq(self, other: Fragment<MAX_DATA_LEN, T>) -> bool {
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
