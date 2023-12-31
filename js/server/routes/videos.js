import express from 'express';
import { BG_VIDEOS_DIR, TRANSITION_VIDEOS_DIR } from '../constants.js';
import { areRedditCredentialsSetup, getAllVideos, mapDirToData } from '../utils.js';
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

router.get("/api/videos/generated", async (req, res) => {
    const videos = await getAllVideos();
    return videos ? res.json(videos) : res.status(500).send('Error getting videos');
});

router.post('/api/videos/create', async function (req, res, next) {
    const conf = req.body.conf;
    if (!conf) return res.status(400).json({ error: 'Missing configuration in the request' })
    const credentialsReady = await areRedditCredentialsSetup();
    if (!credentialsReady) return res.status(400).json({ error: 'Reddit credentials are not set up' })
    await saveVideoToRedis(conf);
    createVideo(conf);
    return res.status(200).end();
});

export { router as videosRoutes };

