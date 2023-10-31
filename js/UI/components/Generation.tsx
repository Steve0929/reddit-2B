import React, { useState } from 'react';
import Image from 'next/image';
import { LinkInput } from './steps/LinkInput';
import { FINAL_STEP, SERVER_URL, SUCCESS_STEP, Step, confObject } from '../constants';
import { Comments } from './steps/Comments';
import { SoundSelect } from './steps/SoundSelect';
import { VideoAssetsSelect } from './steps/VideoAssetsSelect';
import { toast } from 'react-toastify';
import { Processing } from './steps/Processing';
import { useRouter } from 'next/router';
import { getUrlForNewVideo } from '../utils';

const wrapStepComponent = (
  Component: React.ComponentType<{ conf: confObject; setConf: (value: any) => void }> | undefined,
  conf: confObject,
  setConf: (value: any) => void) => {
  return Component ? <Component conf={conf} setConf={setConf} /> : null;
}

const NextButton = ({ label, disabled, handleOnClick }: { label: string, disabled: boolean, handleOnClick: () => void }) => {
  return (
    <button className="ml-8 gummy w-fit cursor-pointer rounded-lg shadow-even text-lg font-bold  bg-[#5AB3FF] text-white border-2 border-[#5AB3FF] px-8 py-2
                       disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300"
      onClick={handleOnClick} disabled={disabled} >
      {label}
    </button>
  )
}

const initConf = {
  postID: null,
  postUrl: '',
  numComments: 3,
  numReplies: 1,
  bgMusic: null,
  bgVideo: null,
  transitionVideo: null
}

export const Generation = ({ fetchVideos }: { fetchVideos: () => void }) => {
  const [step, setStep] = useState(0);
  const [conf, setConf] = useState(initConf);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNextStep = () => setStep(prev => prev + 1)
  const handlePrevStep = () => setStep(prev => prev - 1);

  const stepsMapping: Step[] = [
    {
      step: 0, component: LinkInput, nextStepEnabled: conf?.postID
    },
    {
      step: 1, component: Comments, nextStepEnabled: true
    },
    {
      step: 2, component: SoundSelect, nextStepEnabled: conf?.bgMusic
    },
    {
      step: 3, component: VideoAssetsSelect, nextStepEnabled: conf?.bgVideo && conf?.transitionVideo
    },
    {
      step: 4, component: Processing, nextStepEnabled: true
    }
  ]

  const createVideo = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${SERVER_URL}/api/videos/create`, {
        method: 'POST',
        body: JSON.stringify({ conf: { ...conf, date: new Date() } }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (resp.status === 200) {
        toast.success("Your video is now being created");
        handleNextStep();
        fetchVideos();
      }
      else {
        const videoCreationResponse = await resp.json();
        console.log(videoCreationResponse);
        toast.error(<p>
          There was an error 😔 <br />
          <span className='text-xs'>{videoCreationResponse?.error}
          </span>
        </p>
        )
      }
    } catch (err) { console.log(err) }
    setLoading(false);
  }

  const restartFlow = async () => {
    await router.push(getUrlForNewVideo());
    setConf((prev) => ({ ...prev, postID: initConf.postID, postUrl: initConf.postUrl }))
    setStep(0);
  }

  return (
    <div className=''>
      <div className='flex items-center gap-x-3 mb-6'>
        <Image src={`/write.png`} width={55} height={55} alt='hand-write' />
        <h1 className='text-xl font-bold text-gray-600 mt-4'>Generate new video</h1>
      </div>

      {
        wrapStepComponent(stepsMapping[step]?.component, conf, setConf)
      }

      <div className='ml-auto mt-8 flex w-fit pb-8'>
        {
          step > 0 && step !== SUCCESS_STEP &&
          <div className="gummy w-fit cursor-pointer rounded-lg shadow-even text-lg font-bold  border-[#5AB3FF]
                        bg-white text-[#5AB3FF] border-2 px-8 py-2"
            onClick={handlePrevStep}>
            Go back
          </div>
        }

        {
          step !== FINAL_STEP && step !== SUCCESS_STEP &&
          <NextButton
            label={'Next ►'}
            handleOnClick={handleNextStep}
            disabled={!stepsMapping[step]?.nextStepEnabled} />
        }

        {
          step === FINAL_STEP &&
          <NextButton
            label={loading ? 'Loading...' : 'Generate'}
            handleOnClick={createVideo}
            disabled={!stepsMapping[step]?.nextStepEnabled} />
        }

        {
          step === SUCCESS_STEP &&
          <NextButton
            label={'Create a new video'}
            handleOnClick={restartFlow}
            disabled={false} />
        }
      </div>
    </div>
  )
}
