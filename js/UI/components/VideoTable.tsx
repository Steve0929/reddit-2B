import Image from 'next/image';
import React from 'react';
import { toast } from 'react-toastify';

import { SERVER_URL, VIDEO_STATUS } from '../constants';
import { statusToBadge } from '../utils';

interface VideoTabelProps {
  videos: { videoID: string, status: string, date: string }[],
  loading: boolean,
  handleUpdate: () => void
}

export const VideoTable = ({ videos, loading, handleUpdate }: VideoTabelProps) => {
  const hasVideos = videos?.length > 0;

  const downloadVideo = async (videoID: string) => {
    try {
      const URL = `${SERVER_URL}/${videoID}.mp4`;
      const response = await fetch(URL);
      const responseBlob = await response.blob();
      const url = window.URL.createObjectURL(responseBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${videoID}.mp4`);
      document.body.appendChild(link);
      link.click();
    }
    catch (err) {
      toast.error("😔 There was an error with your download");
      console.log(err);
    }
  }

  return (
    <div>
      <div className='flex items-center gap-x-3 mb-6'>
        <Image src="/camera.png" width={55} height={55} alt='camera' />
        <h1 className='text-xl font-bold text-gray-600 mt-4'>Your videos</h1>
        <div className="ml-auto gummy text-sm w-fit cursor-pointer rounded-lg shadow-even text-lg font-bold 
                        bg-white-500 text-[#5AB3FF] border-2 px-4 py-1" onClick={handleUpdate}>
          {loading ? <div className="spin">⟳</div> : "Update"}
        </div>
      </div>

      <div className={`flex items-center flex-col ${!hasVideos && "rounded-lg bg-[#f6f8fc94] p-4 pb-8"}`}>
        {hasVideos ?
          <div className="flex-row-reverse flex w-full max-h-96 shadow-md rounded-lg overflow-x-auto overflow-y-auto scrollbar">
            <table className="w-full text-sm text-left text-gray-500 max-w-full ">
              <thead className="text-md text-[#7d8595] uppercase bg-[#F9FAFB]">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Video id
                  </th>
                  <th scope="col" className="py-3 px-6 ">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-8 ">
                    Creation date
                  </th>
                  <th scope="col" className="py-3 px-4 ">
                    Download
                  </th>
                </tr>
              </thead>

              <tbody className="">
                {
                  videos.map(video =>
                    <tr key={video.videoID} className="bg-white border-b border-[#e9ecef] text-sm">
                      <td className="py-4 px-6">{video.videoID}</td>
                      <td className="py-4 px-6">{statusToBadge(video.status)}</td>
                      <td className="py-4 px-6">{new Date(video.date).toLocaleString()}</td>
                      {
                        video.status === VIDEO_STATUS.COMPLETED ?
                          <td className="py-4 px-6 cursor-pointer text-[#5AB3FF] font-semibold underline" onClick={() => downloadVideo(video.videoID)}>Download</td>
                          :
                          <td className="py-4 px-6 ">-</td>
                      }
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
          :
          <>
            <Image src="/waiting.png" quality={100} width={60} height={60} alt='waiting' />
            <div className="text-xl text-gray-400 w-fit m-auto mt-1">No videos created yet</div>
          </>
        }
      </div>
    </div>
  )
}