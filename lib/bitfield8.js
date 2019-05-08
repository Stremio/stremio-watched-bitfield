var pako = require('pako')

function BitField8(nSize) {
    var nBytes = Math.ceil(nSize/8)
    this.length = nSize
    this.values = new Uint8Array(nBytes)
    return this
}

BitField8.fromPacked = function(compressed, len) {
    var bf = new BitField8(0)
    bf.values = pako.inflate(compressed)
    bf.length = typeof(len) === 'number' ? len : bf.values.length * 8
    var nBytes = Math.ceil(bf.length / 8)
    if (nBytes > bf.values.length) {
        // resize up so we can fit bf.length
        var newValues = new Uint8Array(nBytes)
        for (var idx in bf.values) {
            newValues[idx] = bf.values[idx]
	}
        bf.values = newValues
    }
    return bf
}

BitField8.prototype.get = function(i) {
    var index = (i / 8) | 0
    var bit = i % 8
    if (!this.values[index]) return false
    return (this.values[index] & (1 << bit)) !== 0
}

BitField8.prototype.set = function(i, val) {
    var index = (i / 8) | 0
    var bit = i % 8
    var mask = 1 << bit
    if (val) this.values[index] |= mask
    else this.values[index] &= ~mask
}

BitField8.prototype.lastIndexOf = function(val) {
	for (var i=this.length-1; i>=0; --i)
		if (this.get(i) === val)
			return i
	return -1
}

BitField8.prototype.toPacked = function() {
    return pako.deflate(this.values)
}

module.exports = BitField8
