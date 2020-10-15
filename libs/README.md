# Dependencies
This folder contains all dependency files WebMP requires.

To better transport over poor network conditions, lots of files are being compressed with BZip2 algorithm, and will be decompressed on-the-fly and on-demand.

# Intended usage
## Critical dependencies
These dependencies are not optional. They are all required to make WebMP running. They should not be compressed at all.

### CryptoJS
Encrypt, decrypt, hash, and convert data, fast and secure.

### MKParser@Phoenix35
Quickly get metadata out of Matroska files.

### LZipper@Blindman67
Compresses and decompresses some data to increase capacity of localStorage and WebStorage.

### metadata-audio-parser@nazar-pc
Library that parse metadata from mp3(ID3v1 and ID3v2 tags)/mp4(aac, m4a, etc.)/ogg audio files

### jsmediatags@aadsm
Get FLAC/IDv3 and other types of metadata out of media files.

### mersennetwister@pigulla
Generates high-quality pseudo-random numbers for several purposes.

### low-pass-filter@rochars
Good for wavetable interpolation and beat detection.

### lpf@uhho
Smoothing out clunky streams of data.

### flvjs@bilibili
Play FLV files, directly.

### fft.js@auroranocker
Quick FFT operations.

### libarchivejs
Decompresses data on-the-fly.

If the version of Chromium on mobile devices is smaller than 78, this dependency is likely to break because the lack of WebAssembly support, making compressed dependencies useless.

## Small-in-size dependencies
These dependencies are small enough to be easily transported. Users can request them on-demand, while they are recommended to be included. Some of them are compressed.

### omnitone@GoogleChrome
If you want to enjoy channel projection, this is a must-have dependency!

### bigint@peterolson
Quick functioning BigInt polyfill and/or wrapper for quick cryptography processing.

### Ruffle
A open-source Adobe Flash player in browser.

Currently only supports AS 1.0/2.0 contents, and AS 3.0 contents will break.

### Tone.js
Used to synthesize MIDI sequences on-the-fly in high quality audio.

### MIDI@Tone.js
Parse MIDI files for Tone.js to use.

### HLS.js@video-dev
Direct playback of Apple HLS streams.

### gifjs@jnordberg
Edit and generate GIF files.

### gifshot@yahoo
Capture GIF files live!

### twemoji@twitter
Universal emoji support.

### dash.js@Dash-Industry-Forum
Direct playback of MPEG-DASH.

### opus-media-recorder@kbumsik
It's MediaRecorder, but all supported.

### blockhash-js@commonmachinery (needs to be treated)
Perceptual hash for JS.

### jschardet@aadsm
Detecting character encoding scheme.

### WebTorrent
Download, stream BitTorrent right inside a browser.

### torrent-discovery@WebTorrent (Node.js) (not yet included)
It's DHT!

### jsQR@cozmo
Reads QR code inside the browser.

### qrcode@davidshimjs
Display QR codes.

### piexifjs@hMatoba
Edit EXIF metadata in a browser.

## Large-in-size dependencies
These dependencies are large, that they can only activate on user requests. All of them are compressed.

### ffmpeg@ffmpegwasm
Full FFmpeg, compiled to WebAssembly.

### ffmpeg.js@kagami
Seperate FFmpeg modules with asm.js!

### fluidsynth-jsport (upcoming)
Use a .mid file and a .sf2 file to synthesize MIDI out.
