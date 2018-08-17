var BitField8 = require('./bitfield8')

function watchedBitfield(bitfield, videoIds) {
	// @WARNING: should call as a constructor; perhaps we should use a guard for that?
	this.bitfield = bitfield
	this.videoIds = videoIds
	return this
}

watchedBitfield.constructFromArray = function(arr, videoIds) {
	var bitfield = new BitField8(arr.length)
	arr.forEach(function(v, i) { bitfield.set(i, v) })
	return new watchedBitfield(bitfield, videoIds)
}

module.exports = watchedBitfield