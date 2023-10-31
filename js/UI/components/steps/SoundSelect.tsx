import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { stepComponentProps, confObject, SERVER_URL } from '../../constants';
import { SoundBlock } from '../common/SoundBlock';


export const SoundSelect = ({ conf, setConf }: stepComponentProps) => {
  const [availableSounds, setAvailableSounds] = useState<[{ path: string, fileName: string }] | []>([]);

  useEffect(() => {
    const getSounds = async () => {
      try {
        const resp = await fetch(`${SERVER_URL}/api/music`);
        const musicResponse = await resp.json();
        setAvailableSounds(musicResponse);
      } catch (err) { }
    }
    getSounds();
  }, [])

  return (
    <Card title={'3. Select background music'} image={'/music.png'}>
      <div className='flex gap-6 w-fit m-auto flex-wrap'>
        {
          availableSounds?.map(_sound => {
            return <SoundBlock key={_sound?.path}
              fileName={_sound?.fileName}
              isSelected={conf?.bgMusic === _sound?.path}
              handleSelect={() => setConf((prev: confObject) => ({ ...prev, bgMusic: _sound.path }))} />
          })
        }
      </div>
    </Card>
  )
}
