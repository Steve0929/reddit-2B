
import './loadenv.js';
import {
    BG_VIDEO_DURATION,
    BG_VIDEO_PATH,
    BG_MUSIC_PATH,
    TRANSITION_PATH,
    TMP_PATH,
    RESIZED_TRANSITION,
    REDDIT_USER_AGENT,
    TEST_POST_ID,
    ASSETS_DIR,
    MUSIC_DIR
} from "./constants.js";
import { areRedditCredentialsSetup, createRandomId, getRandomNumber } from "./utils.js";
import { createImageFromText } from "./images.js";
import { redditPostToScenes } from "./reddit.js";
import { createAudio, getAudioDuration } from './audio.js';
import ffmpeg from 'fluent-ffmpeg';
import express from 'express';
import cors from 'cors';
import redisClient from './redis/appConfig.js';
import Snoowrap from 'snoowrap/dist/snoowrap.js';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (request, response) => {
    return response.send("Hi there");
});

app.get("/api/credentials", async (request, response) => {
    const credentialsReady = await areRedditCredentialsSetup();
    return response.json({ credentials: credentialsReady })
});

app.post("/api/credentials", async (req, res) => {
    const { username, password, clientId, clientSecret } = req.body;
    try {
        const reddit = new Snoowrap({
            "userAgent": REDDIT_USER_AGENT,
            "username": username,
            "password": password,
            "clientId": clientId,
            "clientSecret": clientSecret
        });
        const response = await reddit.getSubmission(TEST_POST_ID).fetch();
        if (response.comments.length) {
            await redisClient.hSet('REDDIT_CREDENTIALS', {
                username: username,
                password: password,
                clientId: clientId,
                clientSecret: clientSecret
            })
            return res.json({ credentials: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.json({ credentials: false });
    }
});

app.post('/api/videos/create', async function (req, res, next) {
    const credentialsReady = await areRedditCredentialsSetup();
    if (!credentialsReady) return res.json({ error: 'Reddit credentials are not set up' })
    const conf = req.body.conf;
    const { postId } = conf;
    const videoID = createRandomId();
    conf.videoID = videoID;
    createVideo(postId, conf);
});

app.get("/api/music", async (req, res) => {
    fs.readdir(MUSIC_DIR, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading directory');
            return;
        }

        // Map file names and paths to a JSON object
        const fileData = files.map((fileName) => {
            const filePath = path.join(MUSIC_DIR, fileName);
            return { fileName, path: filePath };
        });

        // Send the JSON response
        res.json(fileData);
    });
});


app.use(express.static(ASSETS_DIR));

app.listen(2000, () => {
    console.log("Listening on port 2000...");
});


/**
 * TODO read from conf object
const WIDTH = '1920';
const HEIGHT = '1080';
**/

const resizeTransition = async (conf) => {
    console.log("🎛️ Resizing transition scene")
    const RESIZED_TRANSITION_PATH = `${TMP_PATH}/${conf.videoID}/${RESIZED_TRANSITION}`;
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(conf?.TRANSITION_PATH ?? TRANSITION_PATH)
            .size(`${WIDTH}x${HEIGHT}`)
            .saveToFile(RESIZED_TRANSITION_PATH).on(`end`, () => resolve())
    })
    return RESIZED_TRANSITION_PATH;
}

const renderScene = async (scene, conf) => {
    console.log("🖌️ Rendering scene ", JSON.stringify(scene))
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(scene.audio)
            .addInput(conf?.BG_VIDEO_PATH ?? BG_VIDEO_PATH).setStartTime(scene.cutFrom)
            .addInput(scene.image)
            .complexFilter(["[1:v][2:v]overlay=(W-w)/2:(H-h)/2", "[0:a]aformat=fltp:44100:stereo"])
            .setDuration(scene.duration)
            .saveToFile(`${scene.path}`).on('end', () => { resolve() })
    })
}

const createSceneImageAndAudio = async (scene, conf) => {
    //Create audios
    const text = scene.config.reply_text ? scene.config.reply_text : scene.text;
    const audioPath = await createAudio(text, conf);
    const audioDuration = await getAudioDuration(audioPath);
    scene.duration = audioDuration;
    scene.audio = audioPath;
    //Create image
    const image = await createImageFromText(scene.text, scene.user, scene.upvotes, scene.config, conf);
    scene.image = image;
}


const createVideos = async (scenes, conf) => {
    const RESIZED_TRANSITION_PATH = await resizeTransition(conf);
    const videos = new ffmpeg();
    let sceneNum = 0;
    for (const scene of scenes) {
        //Create audios, images and calc total duration
        let totalSceneDuration = 0;
        await createSceneImageAndAudio(scene, conf);
        totalSceneDuration += scene.duration;
        for (const subScene of scene.subScenes) {
            //Create audios, images and calc total duration for replies
            await createSceneImageAndAudio(subScene, conf);
            totalSceneDuration += subScene.duration;
        }

        scene.path = `${TMP_PATH}/${conf.videoID}/scene-${sceneNum}.mp4`;
        videos.addInput(scene.path);
        scene.cutFrom = getRandomNumber(1, BG_VIDEO_DURATION - totalSceneDuration);
        scene.cutTo = scene.cutFrom + scene.duration;
        await renderScene(scene, conf)
        sceneNum++;

        //Subscenes (replies)
        let prevCutTo = scene.cutTo;
        for (const subScene of scene.subScenes) {
            const cutFromSubscene = prevCutTo;
            const cutToSubscene = cutFromSubscene + subScene.duration;
            subScene.cutFrom = cutFromSubscene;
            subScene.cutTo = cutToSubscene;
            subScene.path = `${TMP_PATH}/${conf.videoID}/scene-${sceneNum}.mp4`;
            videos.addInput(subScene.path);
            await renderScene(subScene, conf)
            prevCutTo = cutToSubscene;
            sceneNum++;
        }
        videos.addInput(RESIZED_TRANSITION_PATH);
    }
    return videos;
}

const createVideo = async (postId, conf) => {
    const scenes = await redditPostToScenes(postId, conf);
    const videos = await createVideos(scenes, conf);

    //Merge everything
    console.log("🔄 Merging everything...")
    await new Promise((resolve, reject) => {
        videos.mergeToFile('./final.mp4').on(`end`, () => resolve('done')).on(`start`, c => console.log);
    })
    //Mix background music
    console.log("🎶 Mixing background music...")
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(conf?.BG_MUSIC_PATH ?? BG_MUSIC_PATH).inputOption("-stream_loop -1")
            .addInput('./final.mp4')
            .addOption('-shortest')
            .complexFilter(['[0:a][1:a]amix=inputs=2'])
            .saveToFile('./finalWithMusic.mp4').on(`end`, () => resolve('done'))
    })
    console.log("✅ Done!")
}


//createVideo('16121p5');
//testFluent();
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: true })
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: false })