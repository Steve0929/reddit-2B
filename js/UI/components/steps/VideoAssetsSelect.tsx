import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { stepComponentProps, confObject, SERVER_URL } from '../../constants';
import { VideoBlock } from '../common/VideoBlock';

export const VideoAssetsSelect = ({ conf, setConf }: stepComponentProps) => {
  const [availableVideos, setAvailableVideos] = useState<[{ path: string, fileName: string }] | []>([]);
  const [availableTransitionVideos, setAvailableTransitionVideos] = useState<[{ path: string, fileName: string }] | []>([]);

  const fetchVideoAssets = async (setFunction: (value: any) => void, urlPath: string) => {
    try {
      const resp = await fetch(`${SERVER_URL}/api/videos/${urlPath}`);
      const videosResponse = await resp.json();
      setFunction(videosResponse);
    } catch (err) { }
  }

  useEffect(() => {
    fetchVideoAssets(setAvailableVideos, 'background-videos');
  }, [])

  useEffect(() => {
    fetchVideoAssets(setAvailableTransitionVideos, 'transitions');
  }, [])

  return (
    <Card title={'4. Select background video'} image={'/goldtv.png'}>
      <h2 className='font-semibold text-gray-600 text-lg '>Select the <span className='text-[#5AB3FF]'>background</span> video</h2>
      <div className='flex gap-6 gap-y-12 w-full m-auto pb-8 mt-4 flex-wrap'>
        {
          availableVideos?.map(_video => {
            return <VideoBlock key={_video?.path} parentPath='background'
              fileName={_video?.fileName}
              isSelected={conf?.bgVideo === _video?.path}
              handleSelect={() => setConf((prev: confObject) => ({ ...prev, bgVideo: _video.path }))}
              selectedColor='#5AB3FF'
            />
          })
        }
      </div>

      <div className="flex-grow border-t border-gray-200 mb-6 mt-4  border-dashed" />

      <h1 className='font-semibold text-gray-600 text-lg'>Select the <span className='text-[#7b63f2]'>transition</span> clip</h1>
      <div className='flex gap-6 gap-y-12 w-full m-auto pb-8 mt-4 flex-wrap'>
        {
          availableTransitionVideos?.map(_video => {
            return <VideoBlock key={_video?.path} parentPath='transitions'
              fileName={_video?.fileName}
              isSelected={conf?.transitionVideo === _video?.path}
              handleSelect={() => setConf((prev: confObject) => ({ ...prev, transitionVideo: _video.path }))}
              selectedColor='#7b63f2'
            />
          })
        }
      </div>
    </Card>
  )
}
