## API

`new watchedBitfield(bitfield8, videoIds)`

`watchedBitfield.constructAndResize(serialized, videoIds)`

`watchedBitfield.constructFromArray(arr, videoIds)`

Always use the last two functions in `try..catch`, because they will throw with invalid data


## Misc

How to migrate from `watchedEpisodes`

```
if (Array.isArray(state.watchedEpisodes) && meta.videos.length === state.watchedEpisodes.length) {
	return watchedBitfield.constructFromArray(state.watchedEpisodes, meta.videos.map(function(v) { return v._id }))
}
```