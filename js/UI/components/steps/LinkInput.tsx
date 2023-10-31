import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Card from '../common/Card';
import { confObject, NEW,stepComponentProps } from '../../constants';
import { getIdFromUrl } from '../../utils';

export const LinkInput = ({ conf, setConf }: stepComponentProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [postUrl, setPostUrl] = useState(conf.postUrl);

  useEffect(() => {
    const postID = getIdFromUrl(postUrl);
    setConf((prev: confObject) => ({ ...prev, postID: postID, postUrl: postUrl }));
  }, [postUrl])

  useEffect(() => {
    if (id && !conf?.postID && typeof id === 'string') {
      const redditPostUrl = atob(id);
      redditPostUrl !== NEW && setPostUrl(redditPostUrl);
    }
  }, [id])

  return (
    <Card title="1. Paste the post URL" image="/link.png">
      <input
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        type='text'
        className='mb-5 p-3 w-full border-grey-100 focus:border-[#5AB3FF] rounded-lg border-2 outline-none'
        placeholder='Reddit post url'
      />
      {postUrl.length ?
        conf?.postID ?
          <p className='text-right text-gray-600 '>Looks like a valid URL ✅ </p>
          :
          <p className='text-right text-gray-600'>⚠️ Doesn't seem to be a valid url</p>
        :
        null
      }
    </Card>
  )
}