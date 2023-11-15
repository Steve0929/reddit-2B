import Head from 'next/head';
import Image from 'next/image'
import Router from 'next/router';
import { useState } from 'react';

import { Topbar } from '../../components/Topbar';
import { getIdFromUrl } from '../../utils';

export default function Home() {
  const [postUrl, setPostUrl] = useState('');
  const postID = getIdFromUrl(postUrl);

  return (
    <>
      <Head>
        <title>Reddit-2B</title>
        <meta
          name='description'
          content={`
          Automate the process of creating videos from Reddit posts.
          Easily Turn a Reddit post into a video. Automate video generation including music, text to speech, and transitions by just pasting a URL.
        `}
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='isolate bg-white lg:max-w-screen-xl m-auto px-8'>
        <Topbar />
        <div className='absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]'>
          <svg
            className='relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]'
            viewBox='0 0 1155 678'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill='url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)'
              fillOpacity='.3'
              d='M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z'
            />
            <defs>
              <linearGradient
                id='45de2b6b-92d5-4d68-a6a0-9b9b2abad533'
                x1='1155.49'
                x2='-78.208'
                y1='.177'
                y2='474.645'
                gradientUnits='userSpaceOnUse'
              >
                <stop stopColor='#9089FC' />
                <stop offset={1} stopColor='#FF80B5' />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <main>
          <div className='relative px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl py-32 pt-8'>
              <div className='hidden sm:mb-8 sm:flex sm:justify-center'>

              </div>
              <Image
                src="/logoup.png"
                quality={100}
                width={130}
                height={130}
                alt="logo"
                className='m-auto mb-4'
              />

              <div className='text-center'>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
                  Automate the process of creating videos from Reddit posts
                </h1>
                <p className='mt-6 text-lg leading-8 text-gray-600'>
                  Easily Turn a Reddit post into a video. Automate video generation including music, text to speech and transitions by just pasting a URL.
                </p>
                <div className='mt-10 flex items-center justify-center gap-x-6'>
                  <input
                    value={postUrl} onChange={(e) => setPostUrl(e.target.value)}
                    type='text'
                    className='focus:outline-none focus:border-[#5AB3FF] border-1 border-solid bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[75%] p-2.5'
                    placeholder='Reddit post link'
                  />
                  <button
                    onClick={() => Router.push(`/app/${btoa(postUrl)}`)}
                    disabled={!postID}
                    className='rounded-md bg-[#6173ff] disabled:opacity-40 px-3.5 py-1.5 gummy text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Get started
                  </button>
                </div>
              </div>
              <div className='text-sm'>
                <div className='flex items-center m-auto w-fit mt-14 '>
                  <Image
                    src="/alarm.png"
                    width={45}
                    height={45}
                    alt="logo"
                    className='m-auto mr-4 ugummy'
                  />
                  <p className='text-gray-600 text-justify'><b>Save time - </b>
                    Eliminate the time spent on the creation and edition of graphics, transitions, texts, narration and music. It is all handled automatically for you!</p>
                </div>

                <div className='flex items-center m-auto w-fit mt-8'>
                  <Image
                    src="/flower.png"
                    width={45}
                    height={45}
                    alt="logo"
                    className='m-auto mr-4 ugummy'
                  />
                  <p className='text-gray-600 text-justify'><b>Endless content - </b>
                    Generate videos based on an endless content from Reddit posts and comments including trending news, stories, interesting articles and original discussions.
                  </p>
                </div>

                <div className='flex items-center m-auto w-fit mt-8'>
                  <Image
                    src="/bubblepc.png"
                    width={45}
                    height={45}
                    alt="logo"
                    className='m-auto mr-4 ugummy'
                  />
                  <p className='text-gray-600 text-justify'><b>Local processing - </b>
                    All the image creation, Text to Speech generation and video rendering happens right on your local device with minimal reliance on external dependencies/services except for the Reddit API.
                  </p>
                </div>

              </div>
            </div>
            <div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-42rem)]'>
              <svg
                className='relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]'
                viewBox='0 0 1155 678'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill='url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)'
                  fillOpacity='.3'
                  d='M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z'
                />
                <defs>
                  <linearGradient
                    id='ecb5b0c9-546c-4772-8c71-4d3f06d544bc'
                    x1='1155.49'
                    x2='-78.208'
                    y1='.177'
                    y2='474.645'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#ff4d5c' />
                    <stop offset={1} stopColor='#ff5d32' />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
