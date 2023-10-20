import express from 'express';
import { BG_VIDEOS_DIR, TRANSITION_VIDEOS_DIR } from '../constants.js';
import { areRedditCredentialsSetup, mapDirToData } from '../utils.js';

const router = express.Router();

router.get("/api/background-videos", async (req, res) => {
    const files = await mapDirToData(BG_VIDEOS_DIR);
    return files ? res.json(files) : res.status(500).send('Error reading directory');
});

router.get("/api/transitions", async (req, res) => {
    const files = await mapDirToData(TRANSITION_VIDEOS_DIR);
    return files ? res.json(files) : res.status(500).send('Error reading directory');
});

app.post('/api/videos/create', async function (req, res, next) {
    const credentialsReady = await areRedditCredentialsSetup();
    if (!credentialsReady) return res.json({ error: 'Reddit credentials are not set up' })
    const conf = req.body.conf;
    const { postId } = conf;
    const videoID = createRandomId();
    conf.videoID = videoID;
    createVideo(postId, conf);
});

export { router as videosRoutes };

