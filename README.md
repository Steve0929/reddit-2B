# reddit-2B
Convert Reddit posts to videos. Image creation, Text to Speech generation and video rendering happens right on your local device with minimal reliance on external dependencies/services except for the Reddit API.

## Usage with Docker 🐋
```
docker build -t reddit-2b .
```

```
docker run -p 2000:2000 -p 3000:3000 reddit-2b
```

### 🚧 TODO 
* ~Fetch reddit post info~
* ~Hnadle image creation~
* ~Implement local TTS~
* ~Create rendering FFMPEG pipeline~
* ~Create server~
* ~Create UI~
* ~Dockerize app~ 
* ~Handle background video duration const~
* Handle background music volume
* Allow users to upload custom assets
* Voice model pitch can be changed on the onnx.json
* Allow user to specify video dimensions

