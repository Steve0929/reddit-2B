
import './loadenv.js';
import { BG_VIDEO_DURATION, BG_VIDEO_PATH, BG_MUSIC_PATH, TRANSITION_PATH, TITLE_IMAGE_PATH, CACHE_DIR, BACKGROUND_IMAGE_PATH, AVATAR_IMAGE_PATH } from "./constants.js";
import { getRandomNumber } from "./utils.js";
import Editly from "editly";
import { createImageFromText } from "./images.js";
import { createClipsFromScenes, redditPostToScenes } from "./reddit.js";
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

const createVideo = async (postId) => {
    const scenes = await redditPostToScenes(postId, NUM_COMMENTS, NUM_REPLIES);
    //const clips = await createClipsFromScenes(scenes);
    //return;

    let clips = [];
    for (let scene of scenes) {
        const audioPath = await createAudio(scene.text);
        const sceneDuration = await getAudioDuration(audioPath);
        const cutFrom = getRandomNumber(1, BG_VIDEO_DURATION - sceneDuration);
        const cutTo = cutFrom + sceneDuration;

        const image = await createImageFromText(scene.text, scene.user, scene.upvotes, scene.config);

        const clip = {
            duration: sceneDuration,
            layers: [
                { type: 'video', path: BG_VIDEO_PATH, resizeMode: 'contain-blur', cutFrom: cutFrom, cutTo: cutTo },
                { type: 'image-overlay', path: image, resizeMode: 'contain', width: 0.6, height: 0.25 },
                { type: 'detached-audio', path: audioPath }
            ]
        }
        clips.push(clip);

        //Add replies to same scene
        let prevCutTo = cutTo;
        for (const subscene of scene.subScenes) {
            const audioPathSubscene = await createAudio(subscene.text);
            const subSceneDuration = await getAudioDuration(audioPathSubscene);
            const cutFromSubscene = prevCutTo;
            const cutToSubscene = cutFromSubscene + subSceneDuration;
            const replyImage = await createImageFromText(scene.text, scene.user, scene.upvotes,
                { ...subscene.config, reply_text: subscene.text, reply_user: subscene.user, reply_upvotes: subscene.upvotes });

            let subClip = {
                duration: subSceneDuration,
                layers: [
                    { type: 'video', path: BG_VIDEO_PATH, resizeMode: 'contain-blur', cutFrom: cutFromSubscene, cutTo: cutToSubscene },
                    { type: 'image-overlay', path: replyImage, resizeMode: 'contain', width: 0.6, height: 0.25 },
                    { type: 'detached-audio', path: audioPathSubscene }
                ]
            }
            prevCutTo = cutToSubscene;
            clips.push(subClip);
        }
        clips.push(transitionClip);
    }

    const data = {
        width: 1920, height: 1080,
        outPath: './result.mp4',
        defaults: { transition: null },
        clips: clips,
        audioTracks: [
            { path: BG_MUSIC_PATH, mixVolume: 0.2 },
        ],
        loopAudio: true,
        outputVolume: 3,
    }
    try {
        console.log("creating video...")
        await Editly(data)
    }
    catch (err) {
        console.log(err)
    }
    await new Promise(resolve => setTimeout(resolve, 1500000));
}

const testFluent = async () => {
    /*
     new ffmpeg()
        .addInput(BG_MUSIC_PATH)
        .addInput(BG_VIDEO_PATH).setStartTime(0)
        .addInput(AVATAR_IMAGE_PATH)
        .complexFilter([
            "[1:v][2:v]overlay=(W-w)/2:(H-h)/2"
        ])
        .setDuration(5)
        .saveToFile('./fluent.mp4');
*/
    new ffmpeg()
        .addInput(BG_MUSIC_PATH)
        .addInput(BG_VIDEO_PATH).setStartTime(5)
        .addInput(AVATAR_IMAGE_PATH)
        .complexFilter([
            "[1:v][2:v]overlay=(W-w)/2:(H-h)/2"
        ])
        
        .setDuration(10)
        .saveToFile('./fluent2.mp4');
  /*
        const final = new ffmpeg();
        final.addInput('./fluent.mp4')
        final.addInput('./fluent2.mp4')
        await new Promise(resolve => {
            final.mergeToFile('final.mp4').on(`end`, () => resolve('done')).on(`start`, c => console.log);
        });
     */
}

//createVideo('16121p5');
testFluent();
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: true })
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: false })