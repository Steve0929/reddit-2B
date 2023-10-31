# reddit-2B
Convert Reddit post to videos

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
* Handle background music volume
* Handle background video duration const
* Voice model pitch can be changed on the onnx.json
* Allow users to upload custom assets

