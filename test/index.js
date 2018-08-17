var watchedBitfield = require('../')
var tape = require('tape')

tape('construct from array', function(t) {

	var bitArray = [  0 , 0 , 0 , 0 , 0 , 0 , 1 , 1 , 1 , 1 , 1 ]
	var ids =      [ '1','2','3','4','5','6','7','8','9','a','b' ]

	var wb = watchedBitfield.constructFromArray(bitArray, ids)
	t.deepEquals(wb.videoIds, ids, 'videoIds equal')
	t.deepEquals(range(0, bitArray.length).map(idx => wb.bitfield.get(idx) ? 1 : 0), bitArray, 'bitfield is equal')
	t.end()
})

// helpers lol
function range(a, b) { var ar = []; for (var i=a; i!=b; i++) ar.push(i); return ar }

// API
// new watchedBitfield(buf, videoIds)
// watchedBitfield.constructAndResize(serialized, videoIds)
// watchedBitfield.constructFromArray(arr, videoIds)

// if (Array.isArray(state.watchedEpisodes) && meta.videos.length === state.watchedEpisodes.length) {
// 	watchedBitfield.constructFromArray(state.watchedEpisodes, meta.videos.map(function(v) { return v._id }))
// }