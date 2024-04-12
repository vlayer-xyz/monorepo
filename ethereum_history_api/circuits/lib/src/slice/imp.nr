struct Slice<N> {
    data: [u8; N],
    offset: u64,
    len: u64
}

impl<N> Slice<N> {
    pub fn new(data: [u8; N]) -> Slice<N> {
        Slice { data, offset: 0, len: 0 }
    }

    pub fn new_extended(data: [u8; N], offset: u64, len: u64) -> Slice<N> {
        Slice { data, offset, len }
    }

    pub fn is_empty(self) -> bool {
        self.len == 0
    }

    pub fn len(self) -> u64 {
        self.len
    }

    pub fn at(self, index: u64) -> u8 {
        assert(
            index < self.len, f"Index out of bounds, tried to access index {index} but the length is {self.len}"
        );
        self.data[self.offset + index]
    }

    pub fn push_back(&mut self, value: u8) {
        assert(self.offset + self.len < N, f"Slice capacity exceeded, maximum capacity is {N}");
        self.data[self.offset + self.len] = value;
        self.len += 1;
    }

    pub fn pop_back(&mut self) -> u8 {
        assert(!self.is_empty(), "Cannot pop from an empty slice");
        self.len -= 1;
        self.data[self.offset + self.len]
    }

    pub fn pop_front(&mut self) -> u8 {
        assert(!self.is_empty(), "Cannot pop from an empty slice");
        self.offset += 1;
        self.len -= 1;
        self.data[self.offset - 1]
    }
}
