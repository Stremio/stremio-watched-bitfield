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
	var bitfield = new BitField8(videoIds.length)
	arr.forEach(function(v, i) { bitfield.set(i, v) })
	return new watchedBitfield(bitfield, videoIds)
}

watchedBitfield.constructAndResize = function(serialized, videoIds) {
	// note: videoIds.length could only be >= from serialized lastLength
	// should we assert?
	// we might also wanna assert that the bitfield.length for the returned wb is the same sa videoIds.length

	// serialized is formed by {id}:{len}:{serializedBuf}, but since {id} might contain : we have to pop gradually and then keep the rest
	var components = serialized.split(':')
	if (components.length < 3) throw new Error('invalid components length')

	var serializedBuf = components.pop()
	var anchorLength = parseInt(components.pop(), 10)
	var anchorVideoId = components.join(':')
	var anchorVideoIdx = videoIds.indexOf(anchorVideoId)

	// in case of an previous empty array, this will be 0
	var offset = (anchorLength-1) - anchorVideoIdx

	// We can shift the bitmap in any direction, as long as we can find the anchor video
	var anchorNotFound = anchorVideoIdx === -1
	var mustShift = offset !== 0

	if (anchorNotFound || mustShift) {
		// Resize the buffer
		var resizedBuf = new watchedBitfield(new BitField8(videoIds.length), videoIds)

		if (anchorNotFound) {
			// videoId could not be found, return a totally blank buf
			return resizedBuf
		}

		// rewrite the old buf into the new one, applying the offset 
		var prevBuf = BitField8.fromPacked(atob(serializedBuf), anchorLength)
		for (var i=0; i<videoIds.length; i++) {
			var idxInOld = i+offset
			if (idxInOld >= 0 && idxInOld < prevBuf.length)
				resizedBuf.set(i, prevBuf.get(idxInOld))
		}
		return resizedBuf
	}

	var buf = BitField8.fromPacked(atob(serializedBuf), videoIds.length)
	return new watchedBitfield(buf, videoIds)
}

watchedBitfield.prototype.get = function(idx) {
	return this.bitfield.get(idx)
}

watchedBitfield.prototype.set = function(idx, v) {
	this.bitfield.set(idx, v)
}

watchedBitfield.prototype.setVideo = function(videoId, v) {
	var idx = this.videoIds.indexOf(videoId)
	if (idx === -1) return
	this.bitfield.set(idx, v)
}

watchedBitfield.prototype.getVideo = function(videoId) {
	var idx = this.videoIds.indexOf(videoId)
	if (idx === -1) return false
	return this.bitfield.get(idx)
}

watchedBitfield.prototype.serialize = function() {
	var packed = this.bitfield.toPacked()
	var packedStr = String.fromCharCode.apply(null, packed)
	// set the anchor to the last watched video, rather than the last one
	// that way, we ensure we retain the bitmap, even if some items are removed from the end (upcoming videos)
	var lastIdx = Math.max(0, this.bitfield.lastIndexOf(true))
	//var lastIdx = this.videoIds.length - 1
	return this.videoIds[lastIdx]+':'+(lastIdx + 1)+':'+btoa(packedStr)
}

module.exports = watchedBitfield
