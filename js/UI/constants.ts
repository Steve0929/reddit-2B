export const SERVER_URL = 'http://localhost:2000'
export const MINMUM_COMMENTS = 1;
export const NEW = 'new';

export interface confObject {
  postUrl: string,
  postID: string | null,
  numComments: number,
  numReplies: number,
  bgMusic: string | null,
  bgVideo: string | null,
  transitionVideo: string | null,
  date?: Date,
  videoID?: string
};

export interface stepComponentProps {
  conf: confObject,
  setConf: (value: any) => void;
}

export interface Step {
  step: number,
  component: React.ComponentType<{ conf: confObject; setConf: (value: any) => void }>,
  nextStepEnabled: boolean | null
}

export const VIDEO_STATUS = {
  COMPLETED: "COMPLETED",
  INPROCESS: "INPROCESS",
  FAILED: "FAILED"
}

export const COLORS = {
  GREEN: '#59CE50',
  YELLOW: '#F8AA39',
  RED: '#FF5AA0'
}

export const FINAL_STEP = 3;
export const SUCCESS_STEP = 4;