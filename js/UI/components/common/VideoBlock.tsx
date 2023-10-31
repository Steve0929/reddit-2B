import { useEffect, useRef, useState } from "react";

import { SERVER_URL } from "../../constants";

interface VideoBlockProps {
  fileName: string,
  isSelected: boolean,
  handleSelect: () => void,
  parentPath: string,
  selectedColor?: string
}

export const VideoBlock = ({ fileName, isSelected, handleSelect, parentPath, selectedColor }: VideoBlockProps) => {

  const vidRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const VIDEO_URL = `${SERVER_URL}/videos/${parentPath}/${fileName}`;

  const handlePlay = async () => {
    setPlaying(prev => !prev)
    handleSelect();
  }

  const stopVideo = () => {
    vidRef?.current?.pause();
    vidRef?.current?.load();
  }

  useEffect(() => {
    if (!isSelected) {
      setPlaying(false)
    }
  }, [isSelected])

  useEffect(() => {
    playing ? vidRef?.current?.play() : stopVideo();
    return () => { stopVideo() }
  }, [playing]);

  return (
    <div className="flex-col w-36 h-20" onClick={handlePlay}>
      <div className={`relative rounded-xl shadow cursor-pointer h-full w-full flex transition-transform overflow-hidden bg-black 
            ${playing ? `blockExpandAnim border-2` : ""}   
            ${isSelected && `border-4`} `}
        style={{ borderColor: selectedColor }} >
        <div className="m-auto">
          <video
            preload="metadata"
            ref={vidRef}
            className="w-full h-full"
            src={VIDEO_URL} >
          </video>
        </div>
      </div >
      <div className={`m-auto ${playing ? "mt-6" : "mt-1"} w-[80%] text-sm font-semibold truncate`}
        style={{ color: isSelected ? selectedColor : '#6b7280' }}>
        {fileName}
      </div>
    </div >
  );
}