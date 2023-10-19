import express from 'express';
import { MUSIC_DIR } from '../constants.js';
import { mapDirToData } from '../utils.js';

const router = express.Router();

router.get("/api/music", async (req, res) => {
    const files = await mapDirToData(MUSIC_DIR);
    return files ? res.json(files) : res.status(500).send('Error reading directory');
});

export { router as musicRoutes };