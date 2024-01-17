# reddit-2B

<div align="center" style="display:flex">
  <img src="https://github.com/Steve0929/reddit-2B/assets/26073885/d74da10a-3ea1-4655-9f62-75474065eb8e" width="100px" height="100px" >
</div>

 <strong>reddit-2B</strong> allows you to automatically create a video from any Reddit post. The image creation, Text to Speech generation and video rendering happens right on your local device with minimal reliance on external dependencies/services except for the Reddit API.

## Usage with Docker 🐋
```
docker run -p 2000:2000 -p 3000:3000 steve0929/reddit-2b
```
Go to http://localhost:3000 in your browser.

## Using the app 💻

<div align="center">
  </br>
  <a href="https://www.youtube.com/watch?v=p-e8BSjPDTY">
    <div style="border-radius:50%; border: 1px solid black;" >
      <img src=https://github.com/Steve0929/reddit-2B/assets/26073885/969ddb0e-2fbe-4dcd-86bd-dca8a29920e1" width="640px" alt="usage-video" >
    </div>
  </a>
  https://www.youtube.com/watch?v=p-e8BSjPDTY
</div>


## Setup ⚙️
You need to provide your Reddit credentials (username and password) along with a Reddit app ```client id``` and ```client secret```.

#### How to get client id and secret

1. Login to your Reddit account.
2. Open the link: https://www.reddit.com/prefs/apps and create a new app
3. Select script and fill: app name (any value you like) and redirect uri (you can use http://127.0.0.1):
4. Click on create app and copy your ```client id``` and ```client secret```

![image](https://github.com/Steve0929/reddit-2B/assets/26073885/9b1c90a2-4445-4154-9e6a-4384de87df9f)
<!--- ![image](https://github.com/Steve0929/reddit-2B/assets/26073885/53c3003a-62c5-496e-9aee-1d7197028f02)  --->

### Build/run Docker image from repo
```
git clone https://github.com/Steve0929/reddit-2B
cd reddit-2B
docker build -t reddit-2b .
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
* Sort created videos by timestamp
* Allow users to upload custom video assets
* Allow user to specify video dimensions
* Allow users to choose which comments/reply to include

