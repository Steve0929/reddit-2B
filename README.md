# reddit-2B
Convert Reddit posts to videos. The image creation, Text to Speech generation and video rendering happens right on your local device with minimal reliance on external dependencies/services except for the Reddit API.

## Usage with Docker 🐋
```
docker build -t reddit-2b .
```

```
docker run -p 2000:2000 -p 3000:3000 reddit-2b
```

## Setup
You need to provide your Reddit credentials (username and password) along with a Reddit app client id and client secret.

#### How to get client id and secret

1. Login to your Reddit account.
2. Open the link: https://www.reddit.com/prefs/apps and create a new app
3. Select script and fill: app name (any value you like) and redirect uri (you can use http://127.0.0.1):
4. Click on create app and copy your ```client id``` and ```client secret```

![image](https://github.com/Steve0929/reddit-2B/assets/26073885/9b1c90a2-4445-4154-9e6a-4384de87df9f)
<!--- ![image](https://github.com/Steve0929/reddit-2B/assets/26073885/53c3003a-62c5-496e-9aee-1d7197028f02)  --->

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

