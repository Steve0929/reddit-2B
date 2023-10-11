import Snoowrap from "snoowrap/dist/snoowrap.js";
import { kFormat } from "./utils.js";
import { DEFAULT_NUM_COMMENTS, DEFAULT_NUM_REPLIES } from "./constants.js";


export const redditPostToScenes = async (postId, conf) => {
    const NUM_COMMENTS = conf?.NUM_COMMENTS ?? DEFAULT_NUM_COMMENTS;
    const NUM_REPLIES = conf?.NUM_REPLIES ?? DEFAULT_NUM_REPLIES;
    const response = await fetchRedditPost(postId);
    const scenes = submissionToScenes(response, NUM_COMMENTS, NUM_REPLIES);
    return scenes;
}

export const fetchRedditPost = async (postId) => {
    const reddit = new Snoowrap({
        "userAgent": process.env.REDDIT_USER_AGENT,   // Your USER_AGENT
        "clientId": process.env.REDDIT_CLIENT_ID,     // Your Client ID
        "clientSecret": process.env.REDDIT_CLIENT_SECRET, // Your Client secret
        "username": process.env.REDDIT_USERNAME,      // Your Reddit username
        "password": process.env.REDDIT_PASSWORD      // Your Reddit password
    });
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
