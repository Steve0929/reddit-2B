import path from 'path';
export const ___dirname = path.resolve();

export const AUDIO_DURATION_BUFFER = 0.6;
export const ASSETS_DIR = './js/server/assets';
export const MUSIC_DIR = `${ASSETS_DIR}/sounds`;
export const BG_VIDEOS_DIR = `${ASSETS_DIR}/videos/background`;
export const TRANSITION_VIDEOS_DIR = `${ASSETS_DIR}/videos/transitions`;
export const DEFAULT_NUM_COMMENTS = 1;
export const DEFAULT_NUM_REPLIES = 1;
export const RESIZED_TRANSITION_NAME = 'resized_transition.mp4';
export const DEFAULT_TRANSITION_PATH = './js/server/assets/videos/transitions/transition.mp4';
export const TMP_PATH = './js/server/tmp';
export const PIPER_MODEL_PATH = 'amy/en_US-amy-medium.onnx';
export const TITLE_IMAGE_PATH = './js/server/assets/images/3dwhiteUp.png';
export const AVATAR_IMAGE_PATH = './js/server/assets/images/avatar.png';
export const AVATAR_REPLY_IMAGE_PATH = './js/server/assets/images/avatar1.png';
export const BACKGROUND_IMAGE_PATH = './js/server/assets/images/background.png';
export const UPVOTE_COLOR = '#00de87';
export const DEFAULT_BG_VIDEO_PATH = './js/server/assets/videos/background/background_compressed_med.mp4'; //veed.io
export const BG_VIDEO_DURATION = 119;
export const DEFAULT_BG_MUSIC_PATH = './js/server/assets/sounds/lofi_3.mp3';
export const REDDIT_USER_AGENT = "reddit-2B";
export const TEST_POST_ID = '5kye1c';
export const VIDEO_STATUS = {
    COMPLETED: "COMPLETED",
    INPROCESS: "INPROCESS"
}
export const REDIS_KEYS = {
    REDDIT_CREDENTIALS: 'REDDIT_CREDENTIALS',
    VIDEOS: 'VIDEOS'
}
export const MERGED_FILENAME = 'merged.mp4';
export const GENERATED_VIDEOS_PATH = './js/server/generated';