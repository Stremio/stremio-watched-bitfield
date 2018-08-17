function BitField8(nSize) {
    var nBytes = Math.ceil(nSize/8) | 0
    this.length = nSize
    this.values = new Uint8Array(nBytes)
    return this
}

BitField8.prototype.get = function(i) {
    var index = (i / 8) | 0
    var bit = i % 8
    return (this.values[index] & (1 << bit)) !== 0
}

BitField8.prototype.set = function(i, val) {
    var index = (i / 8) | 0
    var bit = i % 8
    var mask = 1 << bit
    if (val) this.values[index] |= mask
    else this.values[index] &= ~mask
}

module.exports = BitField8