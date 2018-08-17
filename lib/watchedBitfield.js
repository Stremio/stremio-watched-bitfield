var BitField8 = require('./bitfield8')

// @TODO: should we make .bitfield private

function watchedBitfield(bitfield, videoIds) {
	// @TODO: should call as a constructor; perhaps we should use a guard for that?
	this.bitfield = bitfield
	this.videoIds = videoIds
	return this
}

watchedBitfield.constructFromArray = function(arr, videoIds) {
	var bitfield = new BitField8(arr.length)
	arr.forEach(function(v, i) { bitfield.set(i, v) })
	return new watchedBitfield(bitfield, videoIds)
}

watchedBitfield.constructAndResize = function(serialized, videoIds) {
	// @TODO
}

watchedBitfield.get = function(idx) {
	return this.bitfield.get(idx)
}

watchedBitfield.set = function(idx, v) {
	this.bitfield.set(idx, v)
}

module.exports = watchedBitfield