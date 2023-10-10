
import { exec } from 'child_process';
import { promisify } from 'util';
import { createRandomId } from './utils.js';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { PIPER_MODEL_PATH, TMP_PATH } from './constants.js';

const execPromise = promisify(exec);

export const createAudio = async (text, conf) => {
    const randomId = createRandomId();
    const filePath = `${TMP_PATH}/${conf.videoID}/${randomId}.wav`;
    console.log(`creating audio...${randomId}`)
    try {
        const command = `echo "${text}" |  ./piper/piper --model piper/${PIPER_MODEL_PATH} --output_file ${filePath}`
        const { stdout, stderr } = await execPromise(command);  // wait for exec to complete
        return filePath;
    } catch (error) {
        console.log(error);
    }
}

export const getAudioDuration = async (filePath) => {
    return new Promise((resolve, reject) => {
        getAudioDurationInSeconds(filePath).then((duration) => {
            resolve(duration + 0.6);
        })
    })
}

