var pako = require('pako')

function BitField8(nSize) {
    var nBytes = Math.ceil(nSize/8) | 0
    this.length = nSize
    this.values = new Uint8Array(nBytes)
    return this
}

BitField8.fromPacked = function(compressed) {
    var bf = new BitField8(0)
    // @TODO wrong; there should be a separate size thing
    bf.values = pako.inflate(compressed)
    bf.length = bf.values.length * 8
    return bf
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

BitField8.prototype.toPacked = function() {
    return pako.deflate(this.values)
} 

// BitField8.prototype.toString = function() {
//     return String.fromCharCode.apply(null, this.values)
// }

module.exports = BitField8