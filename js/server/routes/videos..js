import express from 'express';
import fs from 'fs';
import path from 'path';
import { BG_VIDEOS_DIR } from '../constants.js';

const router = express.Router();

router.get("/api/background-videos", async (req, res) => {
    fs.readdir(BG_VIDEOS_DIR, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading directory');
            return;
        }
        // Map file names and paths to a JSON object
        const fileData = files.map((fileName) => {
            const filePath = path.join(BG_VIDEOS_DIR, fileName);
            return { fileName, path: filePath };
        });
        res.json(fileData);
    });
});

export { router as videosRoutes };