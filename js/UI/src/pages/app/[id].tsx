import { useEffect, useState } from 'react';

import { Credentials } from '../../../components/Credentials';
import { Generation } from '../../../components/Generation';
import { Topbar } from '../../../components/Topbar';
import { VideoTable } from '../../../components/VideoTable';
import { SERVER_URL } from '../../../constants';


const App = () => {
    const [loading, setLoading] = useState(false);
    const [generatedVideos, setGeneratedVideos] = useState([]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const resp = await fetch(`${SERVER_URL}/api/videos/generated`);
            const generatedVideosResponse = await resp.json();
            generatedVideosResponse && setGeneratedVideos(generatedVideosResponse);
        } catch (err) { console.log(err) }
        setLoading(false);
    }

    useEffect(() => {
        fetchVideos();
    }, [])

    return (
        <div className='isolate bg-white lg:max-w-screen-2xl m-auto px-32'>
            <Topbar />
            <Credentials />
            <div className="flex-grow border-t-2 border-gray-100 mt-8 pb-6 border-dashed" />
            <div className='flex gap-x-20'>
                <div className='w-1/2'> <Generation fetchVideos={fetchVideos} /></div>
                <div className='w-1/2'> <VideoTable loading={loading} videos={generatedVideos} handleUpdate={fetchVideos} /></div>
            </div>
        </div>
    )
}

export default App;