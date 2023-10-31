import Image from "next/image";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../constants";
import { SoundWave } from "./SoundWave";

interface SoundBlockProps {
  fileName: string,
  isSelected: boolean,
  handleSelect: () => void
}

export const SoundBlock = ({ fileName, isSelected, handleSelect }: SoundBlockProps) => {

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = async () => {
    if (!audio) {
      setAudio(new Audio(`${SERVER_URL}/sounds/${fileName}`))
    }
    setPlaying(prev => !prev)
    handleSelect();
  }

  useEffect(() => {
    if (!isSelected) {
      setPlaying(false)
    }
  }, [isSelected])

  useEffect(() => {
    playing ? audio?.play() : audio?.pause();
    return () => { audio?.pause() }
  }, [playing]);

  return (
    <div className="flex-col w-fit" onClick={handlePlay}>
      <div className={`relative bg-white-500 px-3 rounded-xl shadow cursor-pointer p-4 w-28 h-28 flex transition-transform 
          ${playing ? "blockExpandAnim border-2 border-[#5AB3FF]" : ""}  
          ${isSelected && "border-[3px] border-[#5AB3FF]"} `}
      >
        <div className="m-auto">
          {
            playing ?
              <SoundWave height={'25px'} color={'#4faffa'} />
              :
              <Image src="/playbtn.png" quality={100} width={30} height={29} alt='playBtn' />
          }
        </div>
        <div className={`absolute bottom-2 left-0 right-0 m-auto w-fit text-sm font-semibold ${isSelected ? "text-[#5AB3FF]" : "text-gray-500"}`} >{fileName}</div>
      </div >
    </div >
  );
}