import Snoowrap from "snoowrap/dist/snoowrap.js";
import { kFormat } from "./utils.js";

const reddit = new Snoowrap({
    "userAgent": process.env.REDDIT_USER_AGENT,   // Your USER_AGENT
    "clientId": process.env.REDDIT_CLIENT_ID,     // Your Client ID
    "clientSecret": process.env.REDDIT_CLIENT_SECRET, // Your Client secret
    "username": process.env.REDDIT_USERNAME,      // Your Reddit username
    "password": process.env.REDDIT_PASSWORD      // Your Reddit password
});

export const redditPostToScenes = async (postId, NUM_COMMENTS = 2, NUM_REPLIES = 1) => {
    const response = await fetchRedditPost(postId);
    const scenes = submissionToScenes(response, NUM_COMMENTS, NUM_REPLIES);
    return scenes;
}

export const fetchRedditPost = async (postId) => {
    const response = await reddit.getSubmission(postId).fetch();
    const cleanedResponse = cleanRedditResponse(response);
    return cleanedResponse;
}

const cleanRedditResponse = (submission) => {
    for (let i = 0; i < submission.comments.length; ++i) {
        if (submission.comments[i].body === `[removed]`) {
            submission.comments.splice(i, 1);
        } else {
            for (let j = 0; j < submission.comments[i].replies.length; ++j) {
                if (submission.comments[i].replies[j].body === `[removed]`) {
                    submission.comments[i].replies.splice(j, 1);
                }
            }
        }
    }
    return submission;
}

const submissionToScenes = (submission, NUM_COMMENTS, NUM_REPLIES) => {
    let scenes = [];
    //Title of post and subreddit
    const titleScene = {
        text: `R/${submission.subreddit.display_name} - ${submission.title}`,
        user: submission.author.name,
        upvotes: kFormat(submission.ups),
        config: { initialImage: true },
        subScenes: []
    }
    scenes.push(titleScene);

    //Comments and replies
    const numComments = Math.min(NUM_COMMENTS, submission.comments.length);
    for (let i = 0; i < numComments; i++) {
        const comment = submission.comments[i];
        const newScene = {
            text: comment.body,
            user: comment.author.name,
            upvotes: kFormat(comment.ups),
            config: { initialImage: false },
            subScenes: comment.replies.slice(0, NUM_REPLIES).map(reply => ({
                text: comment.body,
                user: comment.author.name,
                upvotes: kFormat(comment.ups),
                config: {
                    initialImage: false,
                    isReply: true,
                    reply_text: reply.body,
                    reply_user: reply.author.name,
                    reply_upvotes: kFormat(reply.ups),
                },
            })),
        }
        scenes.push(newScene);
    }
    return scenes;
}

export const createClipsFromScenes = async (scenes) => {
    let clips = [];
    for (const scene of scenes) {
        const clip = await clipFromScene(scene);
        clips.push(clip);
    }
    return clips;
}

const clipFromScene = async (scene) => {
    const audioPath = await createAudio(scene.text);
    const imagePath = await createImageFromText(scene.text, scene.user, scene.upvotes, scene.config);

    const sceneDuration = await getAudioDuration(audioPath);
    const cutFrom = getRandomNumber(1, BG_VIDEO_DURATION - sceneDuration);
    const cutTo = cutFrom + sceneDuration;

    const clip = {
        duration: sceneDuration,
        layers: [
            { type: 'video', path: BG_VIDEO_PATH, resizeMode: 'contain-blur', cutFrom: cutFrom, cutTo: cutTo },
            { type: 'image-overlay', path: imagePath, resizeMode: 'contain', width: 0.6, height: 0.25 },
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
        return clip;
    }
}