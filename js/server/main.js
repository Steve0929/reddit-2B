
import './loadenv.js';
import {
    BG_VIDEO_DURATION, BG_VIDEO_PATH, BG_MUSIC_PATH,
    TRANSITION_PATH, TITLE_IMAGE_PATH, CACHE_DIR,
    BACKGROUND_IMAGE_PATH, AVATAR_IMAGE_PATH,
    AVATAR_REPLY_IMAGE_PATH
} from "./constants.js";
import { getRandomNumber } from "./utils.js";
import { createImageFromText } from "./images.js";
import { redditPostToScenes } from "./reddit.js";
import { createAudio, getAudioDuration } from './audio.js';
import ffmpeg from 'fluent-ffmpeg';

//read from env
const NUM_COMMENTS = 1;
const NUM_REPLIES = 1;
const WIDTH = '1920';
const HEIGHT = '1080';
let RESIZED_TRANSITION_PATH = './resized.mp4';
//

const resizeTransition = async () => {
    console.log("🎛️ Resizing transition scene")
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(TRANSITION_PATH)
            .size(`${WIDTH}x${HEIGHT}`)
            .saveToFile(RESIZED_TRANSITION_PATH).on(`end`, () => resolve())
    })
}

const renderScene = async (scene) => {
    console.log("🖌️ Rendering scene ", JSON.stringify(scene))
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(scene.audio)
            .addInput(BG_VIDEO_PATH).setStartTime(scene.cutFrom)
            .addInput(scene.image)
            .complexFilter(["[1:v][2:v]overlay=(W-w)/2:(H-h)/2", "[0:a]aformat=fltp:44100:stereo"])
            .setDuration(scene.duration)
            .saveToFile(`${scene.path}`).on('end', () => { resolve() })
    })
}

const createVideos = async (scenes) => {
    await resizeTransition();
    const videos = new ffmpeg();
    let sceneNum = 0;
    for (const scene of scenes) {
        //Create audios and calc total duration
        let totalSceneDuration = 0;
        const audioPath = await createAudio(scene.text);
        const audioDuration = await getAudioDuration(audioPath);
        scene.duration = audioDuration;
        scene.audio = audioPath;
        totalSceneDuration += audioDuration;
        //Create image
        const image = await createImageFromText(scene.text, scene.user, scene.upvotes, scene.config);
        scene.image = image;
        for (const subScene of scene.subScenes) {
            const audioPathSubScene = await createAudio(subScene.config.reply_text);
            const subSceneDuration = await getAudioDuration(audioPathSubScene);
            subScene.duration = subSceneDuration;
            subScene.audio = audioPathSubScene;
            totalSceneDuration += subSceneDuration;
            //Create image
            const image = await createImageFromText(subScene.text, subScene.user, subScene.upvotes, subScene.config);
            subScene.image = image;
        }
        scene.path = `./scene-${sceneNum}.mp4`;
        videos.addInput(scene.path);
        scene.cutFrom = getRandomNumber(1, BG_VIDEO_DURATION - totalSceneDuration);
        scene.cutTo = scene.cutFrom + scene.duration;
        await renderScene(scene)
        sceneNum++;

        //Subscenes (replies)
        let prevCutTo = scene.cutTo;
        for (const subScene of scene.subScenes) {
            const cutFromSubscene = prevCutTo;
            const cutToSubscene = cutFromSubscene + subScene.duration;
            subScene.cutFrom = cutFromSubscene;
            subScene.cutTo = cutToSubscene;
            subScene.path = `./scene-${sceneNum}.mp4`;
            videos.addInput(subScene.path);
            await renderScene(subScene)
            prevCutTo = cutToSubscene;
            sceneNum++;
        }
        videos.addInput(RESIZED_TRANSITION_PATH);
    }
    return videos;
}

const createVideo = async (postId) => {
    const scenes = await redditPostToScenes(postId, NUM_COMMENTS, NUM_REPLIES);
    const videos = await createVideos(scenes);

    //Merge everything
    console.log("🔄 Merging everything...")
    await new Promise((resolve, reject) => {
        videos.mergeToFile('./final.mp4').on(`end`, () => resolve('done')).on(`start`, c => console.log);
    })
    //Mix background music
    console.log("🎶 Mixing background music...")
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(BG_MUSIC_PATH).inputOption("-stream_loop -1")
            .addInput('./final.mp4')
            .addOption(`-shortest`)
            .complexFilter(['[0:a][1:a]amix=inputs=2'])
            .saveToFile('./finalWithMusic.mp4').on(`end`, () => resolve('done'))
    })
    console.log("✅ Done!")
    await new Promise(resolve => setTimeout(resolve, 1500000));
}


createVideo('16121p5');
//testFluent();
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: true })
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: false })