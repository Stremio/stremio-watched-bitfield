# stremio-watched-bitfield

This module implements a way to efficiently store a bitfield that represents watched videos for a MetaItem. The bitfield is supposed to be stored in LibItem. It is designed in such a way, that if an MetaItem updates it's set of videos, the bitfield will adjust to it as well.

This assumes that the only two ways that `MetaItem.videos` can change is by pushing new videos to the back or by shifting videos from the front.

If anything else happens, the bitfield will become inconsistent.


## API

### Ways to create an instance

`new watchedBitfield(bitfield8, videoIds)` - this will construct an instance directly from a bitfield and `videoIds`; not intended to be used directly

`watchedBitfield.constructAndResize(serialized, videoIds)` - this will construct an instance from a serialized string representation, and adjust it's size (resize and shift the bitfield) if the passed `videoIds` array is different from the one the serialized string was created with; this is the main way this library is intended to be used

`watchedBitfield.constructFromArray(arr, videoIds)` - constructs an instance from the legacy bitfield array (e.g. `[0,1,1,0]`) used in `libraryItem.state.watchedEpisodes`; kept for migration reasons

Always use the last two functions in `try..catch`, because they will throw with invalid data


### Instance methods

`wb.serialize()` - returns a serialized string representation

`wb.setVideo(videoId, isWatched)` - sets the video ID to `isWatched` (`true` or `false`)


## Misc

How to migrate from `watchedEpisodes`

```
if (Array.isArray(state.watchedEpisodes) && meta.type === 'series' && meta.videos.length >= state.watchedEpisodes.length) {
	return watchedBitfield.constructFromArray(state.watchedEpisodes, meta.videos.map(function(v) { return v._id }))
}
```
