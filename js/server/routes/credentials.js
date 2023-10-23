import express from 'express';
import Snoowrap from 'snoowrap/dist/snoowrap.js';
import redisClient from '../redis/appConfig.js';
import { REDDIT_USER_AGENT, REDIS_KEYS, TEST_POST_ID } from '../constants.js';
import { areRedditCredentialsSetup } from '../utils.js';

const router = express.Router();

router.get("/api/credentials", async (request, response) => {
    const credentialsReady = await areRedditCredentialsSetup();
    return response.json({ credentials: credentialsReady })
});

router.post("/api/credentials", async (req, res) => {
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
            await redisClient.hSet(REDIS_KEYS.REDDIT_CREDENTIALS, {
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

export { router as credentialsRoutes };