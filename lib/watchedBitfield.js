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
	var components = serialized.split(';')
	if (components.length != 3) throw 'invalid components length'
	var lastVideoId = serialized[0]
	var length = parseInt(serialized[1])
	var buf = atob(serialized[2])

	console.log(buf)
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