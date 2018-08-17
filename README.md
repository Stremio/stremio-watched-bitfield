# stremio-watched-bitfield

This module implements a way to efficiently store a bitfield that represents watched videos for a MetaItem. The bitfield is supposed to be stored in LibItem. It is designed in such a way, that if an MetaItem updates it's set of videos, the bitfield will adjust to it as well.

This assumes that the only two ways that `MetaItem.videos` can change is by pushing new videos to the back or by shifting videos from the front.

If anything else happens, the bitfield will become inconsistent.


## API

`new watchedBitfield(bitfield8, videoIds)`

`watchedBitfield.constructAndResize(serialized, videoIds)`

`watchedBitfield.constructFromArray(arr, videoIds)`

Always use the last two functions in `try..catch`, because they will throw with invalid data


## Misc

How to migrate from `watchedEpisodes`

```
if (Array.isArray(state.watchedEpisodes) && meta.type === 'series' && meta.videos.length >= state.watchedEpisodes.length) {
	return watchedBitfield.constructFromArray(state.watchedEpisodes, meta.videos.map(function(v) { return v._id }))
}
```
