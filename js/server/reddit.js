import Snoowrap from "snoowrap/dist/snoowrap.js";
import { kFormat } from "./utils.js";
import redisClient from "./redis/appConfig.js";
import { REDIS_KEYS } from "./constants.js";

export const redditPostToScenes = async (conf) => {
    const { postID } = conf;
    const NUM_COMMENTS = conf?.numComments;
    const NUM_REPLIES = conf?.numReplies;
    const response = await fetchRedditPost(postID);
    const scenes = submissionToScenes(response, NUM_COMMENTS, NUM_REPLIES);
    return scenes;
}

export const fetchRedditPost = async (postID) => {
    const REDDIT_CREDS = await redisClient.hGetAll(REDIS_KEYS.REDDIT_CREDENTIALS);
    const reddit = new Snoowrap({
        "userAgent": REDDIT_CREDS.userAgent,
        "clientId": REDDIT_CREDS.clientId,
        "clientSecret": REDDIT_CREDS.clientSecret,
        "username": REDDIT_CREDS.username,
        "password": REDDIT_CREDS.password
    });
    const response = await reddit.getSubmission(postID).fetch();
    const cleanedResponse = cleanRedditResponse(response);
    return cleanedResponse;
}

const cleanRedditResponse = (submission) => {
    for (let i = 0; i < submission.comments.length; ++i) {
        if (submission.comments[i].body === `[removed]` || submission.comments[i].body.includes(`[deleted]`)) {
            submission.comments.splice(i, 1);
        } else {
            for (let j = 0; j < submission.comments[i].replies.length; ++j) {
                if (submission.comments[i].replies[j].body === `[removed]` || submission.comments[i].replies[j].body.includes(`[deleted]`)) {
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
