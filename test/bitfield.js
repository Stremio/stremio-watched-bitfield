var BitField8 = require('../lib/bitfield8')
var tape = require('tape')

// @TODO: if bitfield is made private, make separate BitField8 test

tape('construct and set', function(t) {
	var f = new BitField8(8)

	t.ok(f, 'has bitfield')

	for (var i=3; i!=6; i++) f.set(i, true)

	for (var i=0; i!=f.length; i++) t.equal(f.get(i), i >= 3 && i<6, 'is right val')

	t.end()
})

tape('compress and decompress', function(t) {
	var f = new BitField8(9)

	t.ok(f, 'has bitfield')

	for (var i=3; i!=6; i++) f.set(i, true)

	var ff = BitField8.fromPacked(f.toPacked(), f.length)

	for (var i=0; i!=f.length; i++)
		t.equal(ff.get(i), i >= 3 && i<6, 'is right val')

	t.equal(f.length, ff.length)

	t.end()
})

