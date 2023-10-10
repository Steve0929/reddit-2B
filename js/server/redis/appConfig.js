import { createClient } from 'redis';
let redisClient;

(async () => {
    console.log("Init redis client");
    redisClient = createClient();
    redisClient.on("error", (error) => console.error(`Error Redis: ${error}`));
    await redisClient.connect();
    const initConf = await redisClient.sendCommand(["CONFIG", "GET", "appendonly"]);
    if (initConf[1] !== 'yes') {
        console.log("Setting persistance mode as appendonly - yes")
        await redisClient.sendCommand(["CONFIG", "SET", "appendonly", "yes"]);
    }

})();


export default redisClient;