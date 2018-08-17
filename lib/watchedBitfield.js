var BitField8 = require('./bitfield8')
var atob = require('atob')
var btoa = require('btoa')

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
	// @TODO: move the logic to other functions
	var components = serialized.split(':')
	if (components.length != 3) throw 'invalid components length'

	var lastVideoId = components[0]
	var lastLength = parseInt(components[1], 10)
	var lastVideoIdx = videoIds.indexOf(lastVideoId)

	var offset = (lastLength-1) - lastVideoIdx

	if (offset !== 0) {
		// Resize the buffer
		var resizedBuf = new watchedBitfield(new BitField8(videoIds.length), videoIds)

		// if offset < 0, it means we've unshifted videos, which is not allowed
		// we can only shift from the beginning, or push to the back (moves in this <- direction)
		if (lastVideoIdx === -1 || offset < 0) {
			// videoId could not be found, return a totally blank buf
			return resizedBuf
		}

		if (offset > 0) {
			var buf = BitField8.fromPacked(atob(components[2]), lastLength)
			for (var i=offset; i!=buf.length; i++) {
				resizedBuf.set(i-offset, buf.get(i))
			}
			return resizedBuf
		}
	}

	var buf = BitField8.fromPacked(atob(components[2]), videoIds.length)
	return new watchedBitfield(buf, videoIds)
}

watchedBitfield.prototype.get = function(idx) {
	return this.bitfield.get(idx)
}

watchedBitfield.prototype.set = function(idx, v) {
	this.bitfield.set(idx, v)
}

watchedBitfield.prototype.serialize = function() {
	var packed = this.bitfield.toPacked()
	var packedStr = String.fromCharCode.apply(null, packed)
	return this.videoIds[this.videoIds.length-1]+':'+this.bitfield.length+':'+btoa(packedStr)
}

module.exports = watchedBitfield