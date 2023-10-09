import { createClient } from 'redis';

let redisClient;

(async () => {
    redisClient = createClient();
    redisClient.on("error", (error) => console.error(`Error Redis: ${error}`));
    await redisClient.connect();
})();


export default redisClient;