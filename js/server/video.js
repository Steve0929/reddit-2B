import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs'
import {
    DEFAULT_BG_VIDEO_PATH,
    DEFAULT_BG_MUSIC_PATH,
    DEFAULT_TRANSITION_PATH,
    TMP_PATH,
    RESIZED_TRANSITION_NAME,
    DEFAULT_NUM_COMMENTS,
    DEFAULT_NUM_REPLIES,
    VIDEO_STATUS,
    REDIS_KEYS,
    MERGED_FILENAME,
    GENERATED_VIDEOS_PATH,
} from "./constants.js";
import { createRandomId, getRandomNumber } from "./utils.js";
import { redditPostToScenes } from "./reddit.js";
import { createAudio, getAudioDuration } from './audio.js';
import { createImageFromText } from "./images.js";
import redisClient from './redis/appConfig.js';
import { promisify } from 'util';

const resizeTransition = async (conf) => {
    console.log("🎛️ Resizing transition scene")
    const RESIZED_TRANSITION_PATH = `${TMP_PATH}/${conf.videoID}/${RESIZED_TRANSITION_NAME}`;
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(conf?.transitionVideo)
            .size(`${WIDTH}x${HEIGHT}`)
            .saveToFile(RESIZED_TRANSITION_PATH).on(`end`, () => resolve())
    })
    return RESIZED_TRANSITION_PATH;
}

const renderScene = async (scene, conf) => {
    console.log("🖌️ Rendering scene ")
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(scene.audio)
            .addInput(conf?.bgVideo).setStartTime(scene.cutFrom)
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
    const BG_VIDEO_DURATION = await getVideoDuration(conf?.bgVideo);
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

const getVideoDuration = async (videoPath) => {
    const ffprobePromise = promisify(ffmpeg.ffprobe);
    const metadata = await ffprobePromise(videoPath);
    const duration = metadata.format.duration;
    console.log("⏱️ Background video duration is: ", duration);
    return duration;
}


// TODO read from conf object to allow user specify video size
const WIDTH = '1920';
const HEIGHT = '1080';

export const createVideo = async (conf) => {
    try {
        fs.mkdirSync(`${TMP_PATH}/${conf.videoID}`);
        const scenes = await redditPostToScenes(conf);
        const videos = await createVideos(scenes, conf);

        //Merge everything
        console.log("🔄 Merging everything...")
        await new Promise((resolve, reject) => {
            videos.mergeToFile(`${TMP_PATH}/${conf.videoID}/${MERGED_FILENAME}`).on(`end`, () => resolve('done')).on(`start`, c => console.log);
        })
        //Mix background music
        console.log("🎶 Mixing background music...")
        await new Promise((resolve, reject) => {
            new ffmpeg()
                .addInput(conf?.bgMusic).inputOption("-stream_loop -1")
                .addInput(`${TMP_PATH}/${conf.videoID}/${MERGED_FILENAME}`)
                .addOption('-shortest')
                .complexFilter(['[0:a][1:a]amix=inputs=2'])
                .saveToFile(`${GENERATED_VIDEOS_PATH}/${conf.videoID}.mp4`).on(`end`, () => resolve('done'))
        })
        //Clear video tmp files
        console.log("🧹 Cleaning up...");
        fs.rmSync(`${TMP_PATH}/${conf.videoID}`, { recursive: true });
        await updateVideoStatus(conf.videoID, VIDEO_STATUS.COMPLETED);
        console.log("✅ Done!")
    } catch (err) {
        updateVideoStatus(conf.videoID, VIDEO_STATUS.FAILED)
        console.log("⚠️ There was an error while creating the video ", err)
    }
}

const setDefaults = (conf) => {
    const videoID = createRandomId();
    conf.videoID = videoID;
    conf.numComments = conf?.numComments ?? DEFAULT_NUM_COMMENTS;
    conf.numReplies = conf?.numReplies ?? DEFAULT_NUM_REPLIES;
    conf.transitionVideo = conf?.transitionVideo ?? DEFAULT_TRANSITION_PATH;
    conf.bgVideo = conf?.bgVideo ?? DEFAULT_BG_VIDEO_PATH;
    conf.bgMusic = conf?.bgMusic ?? DEFAULT_BG_MUSIC_PATH;
}

export const saveVideoToRedis = async (conf) => {
    setDefaults(conf);
    const videoData = JSON.stringify({ status: VIDEO_STATUS.INPROCESS, conf: conf });
    await redisClient.hSet(REDIS_KEYS.VIDEOS, conf.videoID, videoData);
}

export const updateVideoStatus = async (videoID, status) => {
    const videoInfoString = await redisClient.hGet(REDIS_KEYS.VIDEOS, videoID);
    if (videoInfoString) {
        const videoInfo = JSON.parse(videoInfoString);
        videoInfo.status = status;
        await redisClient.hSet(REDIS_KEYS.VIDEOS, videoID, JSON.stringify(videoInfo));
    }
}