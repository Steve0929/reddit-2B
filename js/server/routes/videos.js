import express from 'express';
import { BG_VIDEOS_DIR, TRANSITION_VIDEOS_DIR } from '../constants.js';
import { areRedditCredentialsSetup, mapDirToData } from '../utils.js';
import { createVideo, saveVideoToRedis } from '../video.js';

const router = express.Router();

router.get("/api/videos/background-videos", async (req, res) => {
    const files = await mapDirToData(BG_VIDEOS_DIR);
    return files ? res.json(files) : res.status(500).send('Error reading directory');
});

router.get("/api/videos/transitions", async (req, res) => {
    const files = await mapDirToData(TRANSITION_VIDEOS_DIR);
    return files ? res.json(files) : res.status(500).send('Error reading directory');
});

router.post('/api/videos/create', async function (req, res, next) {
    const conf = req.body.conf;
    if (!conf) return res.status(400).json({ error: 'Missing configuration in the request' })
    const credentialsReady = await areRedditCredentialsSetup();
    if (!credentialsReady) return res.status(400).json({ error: 'Reddit credentials are not set up' })
    try {
        await saveVideoToRedis(conf);
        createVideo(conf);
        return res.status(200);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: err })
    }
});

export { router as videosRoutes };

