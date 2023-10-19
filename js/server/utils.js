import fs from 'fs';
import redisClient from './redis/appConfig.js';
import path from 'path';

export const createRandomId = () => {
    return Math.random().toString(16).slice(2);
}

export const localImageToUri = (path) => {
    const image = fs.readFileSync(path);
    const base64Image = new Buffer.from(image).toString('base64');
    const dataURI = `data:image/jpeg;base64,${base64Image}`;
    return dataURI;
}

export const getRandomNumber = (min, max) => {
    // Generate a random decimal between 0 (inclusive) and 1 (exclusive)
    const randomDecimal = Math.random();
    // Scale the random decimal to the desired range
    const randomInRange = min + randomDecimal * (max - min);
    // Use Math.floor to truncate the decimal and get an integer
    return Math.floor(randomInRange);
}

export const kFormat = (num) => {
    return Math.abs(num) > 999
        ? `${Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1))}k`
        : Math.sign(num) * Math.abs(num);
}

export const areRedditCredentialsSetup = async () => {
    const REDDIT_CREDS = await redisClient.hGetAll('REDDIT_CREDENTIALS');
    return REDDIT_CREDS?.username && REDDIT_CREDS?.clientSecret;
}

export const mapDirToData = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error('Error reading directory', err);
                reject(err);
                return;
            }
            // Map file names and paths to a JSON object
            const fileData = files.map((fileName) => {
                const filePath = path.join(dir, fileName);
                return { fileName, path: filePath };
            });
            resolve(fileData);
        });
    })
}