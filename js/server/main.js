
import './loadenv.js';
import express from 'express';
import cors from 'cors';

import { musicRoutes } from './routes/music.js';
import { credentialsRoutes } from './routes/credentials.js';
import { videosRoutes } from './routes/videos.js';
import { ASSETS_DIR } from "./constants.js";

const app = express();
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (request, response) => {
    return response.send("Hi there");
});

app.use(credentialsRoutes);
app.use(musicRoutes);
app.use(videosRoutes);

app.use(express.static(ASSETS_DIR));

app.listen(2000, () => {
    console.log("Listening on port 2000...");
});


//createVideo('16121p5');
//testFluent();
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: true })
//createImageFromText("Amanda Byness story breaks my heart", "steve", 20000, { initialImage: false })