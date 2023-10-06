
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
//

const transitionClip = {
    layers: [
        { type: 'video', path: TRANSITION_PATH, resizeMode: 'contain-blur' },
        { type: 'detached-audio', path: TRANSITION_PATH },
    ]
}


const renderScene = async (scene) => {
    console.log("Rendering scene ", JSON.stringify(scene))
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
    const final = new ffmpeg();
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
            const audioPathSubScene = await createAudio(subScene.text);
            const subSceneDuration = await getAudioDuration(audioPathSubScene);
            subScene.duration = subSceneDuration;
            subScene.audio = audioPathSubScene;
            totalSceneDuration += subSceneDuration;
            //
            const image = await createImageFromText(subScene.text, subScene.user, subScene.upvotes, subScene.config);
            subScene.image = image;
        }
        scene.path = `./scene-${sceneNum}.mp4`;
        final.addInput(scene.path);
        final.addInput(TRANSITION_PATH);
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
            final.addInput(subScene.path);
            final.addInput(TRANSITION_PATH);
            await renderScene(subScene)
            prevCutTo = cutToSubscene;
            sceneNum++;
        }

    }
    return final;
}

const createVideo = async (postId) => {
    const scenes = await redditPostToScenes(postId, NUM_COMMENTS, NUM_REPLIES);
    const final = await createVideos(scenes);

    //Merge everything and mix background music
    console.log("🔄 Merging everything...")
    final.addInput(BG_MUSIC_PATH).inputOption("-stream_loop -1");
    await new Promise((resolve, reject) => {
        final.mergeToFile('./final.mp4').on(`end`, () => resolve('done')).on(`start`, c => console.log);
    })
    console.log("Done!")
    await new Promise(resolve => setTimeout(resolve, 1500000));
}

const testFluent = async () => {
    /*
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput('./172185998e53b.wav')
            .addInput(BG_VIDEO_PATH).setStartTime(0)
            .addInput(AVATAR_IMAGE_PATH)
            .complexFilter([
                "[1:v][2:v]overlay=(W-w)/2:(H-h)/2",
                "[0:a]aformat=fltp:44100:stereo"
            ])
            .setDuration(5)
            .saveToFile('./fluent.mp4').on('end', () => { resolve() })
    })
    */

    console.log("merging")
    //resize transition
    const resizedTrans = './trans.mp4'
    /*
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(TRANSITION_PATH)
            .size('1920x1080') // Apply the resizing filter
            .saveToFile(resizedTrans).on(`end`, () => resolve('done'))
    })

    await new Promise((resolve, reject) => {
        const final = new ffmpeg()
        final.addInput('./fluent.mp4')
        final.addInput(resizedTrans)
        final.mergeToFile('final.mp4').on(`end`, () => resolve('done')).on('error', (err, stdout, stderr) => {
            console.error('An error occurred:', err.message);
            //console.error('FFmpeg stdout:', stdout);
            console.error('FFmpeg stderr:', stderr);
        })
    })
*/
    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(BG_MUSIC_PATH).inputOption("-stream_loop -1")
            .addInput('./final.mp4')
            .addOption(`-shortest`)
            .complexFilter(['[0:a][1:a]amix=inputs=2'])
            .saveToFile('./finalWithMusic.mp4').on(`end`, () => resolve('done'))
    })

    return;

    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(BG_MUSIC_PATH)
            .addInput(BG_VIDEO_PATH).setStartTime(0)
            .addInput(AVATAR_IMAGE_PATH)
            .complexFilter([
                "[1:v][2:v]overlay=(W-w)/2:(H-h)/2"
            ])
            .setDuration(5)
            .saveToFile('./fluent.mp4').on('end', () => { resolve() })
    })

    await new Promise((resolve, reject) => {
        new ffmpeg()
            .addInput(BG_MUSIC_PATH)
            .addInput(BG_VIDEO_PATH).setStartTime(5)
            .addInput(AVATAR_REPLY_IMAGE_PATH)
            .complexFilter([
                "[1:v][2:v]overlay=(W-w)/2:(H-h)/2"
            ])
            .setDuration(10)
            .saveToFile('./fluent2.mp4').on('end', () => { resolve() })
    })

    await new Promise((resolve, reject) => {
        const final = new ffmpeg();
        final.addInput('./fluent.mp4')
        final.addInput('./fluent2.mp4')
        final.mergeToFile('final.mp4').on(`end`, () => resolve('done')).on(`start`, c => console.log);
    })
}

//createVideo('16121p5');
testFluent();
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: true })
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: false })