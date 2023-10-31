import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { SERVER_URL } from '../constants';
import { getCredentialStatusBadge } from '../utils';

export const Credentials = () => {
    const [credentialsReady, setCredentialsReady] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkCredentialsSetup = async () => {
            try {
                const resp = await fetch(`${SERVER_URL}/api/credentials`);
                const credentialsReadyResponse = await resp.json();
                setCredentialsReady(credentialsReadyResponse?.credentials);
            } catch (err) {
                console.log(err);
            }
        }
        checkCredentialsSetup();
    }, [])



    const testConnection = async () => {
        setLoading(true);
        try {
            const resp = await fetch(`${SERVER_URL}/api/credentials`, {
                method: 'POST',
                body: JSON.stringify({ username: username, password: password, clientId: clientId, clientSecret: clientSecret }),
                headers: {
                    'Content-Type': 'application/json', // Specify that you're sending JSON data
                },
            });
            const credentialsReadyResponse = await resp.json();

            if (credentialsReadyResponse?.credentials) {
                setCredentialsReady(credentialsReadyResponse?.credentials);
                toast.success("Connection worked! Credentials are saved.")
                setIsOpen(false);
            }
            else {
                toast.error("Connection failed! Please check your credentials.")
            }
        } catch (err) { console.log(err) }
        setLoading(false);
    }

    return (
        <>
            <div className='flex pt-12 w-full'>
                <div className='flex group hover:cursor-pointer items-center rounded-xl shadow-even px-3 py-4 w-1/3'
                    onClick={() => setIsOpen(true)}>
                    <Image
                        src="/key.png"
                        width={50}
                        height={50}
                        alt="logo"
                        className='mr-3 group-hover:rotate-12 transition-transform'
                    />
                    <div className="flex-grow border-l-2 border-gray-100 border-solid h-full mr-3" />
                    <div className='font-semibold text-gray-600 text-xl'>
                        Reddit connection: {' '}
                        <span>{getCredentialStatusBadge(credentialsReady)}</span>
                        <p className='text-sm mt-1'>
                            Reddit 2B only uses your credentials to retrieve data from the Reddit API.
                        </p>
                    </div>
                </div>
            </div>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50" >
                <div className="fixed inset-0 bg-gray-100/30 backdrop-blur" aria-hidden="true" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-sm rounded bg-white rounded-2xl px-4 py-8 shadow-even text-center  w-1/2">
                        <div className='m-auto'>
                            <Dialog.Title className='font-semibold text-gray-600 text-xl'>Enter your Reddit credentials</Dialog.Title>
                            <input
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                type='text'
                                className='mt-4 focus:outline-none focus:border-[#5AB3FF] border-1 border-solid bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                placeholder='Reddit username'
                            />

                            <input
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                type='password'
                                className='mt-4 focus:outline-none focus:border-[#5AB3FF] border-1 border-solid bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                placeholder='Reddit password'
                            />

                            <input
                                value={clientId} onChange={(e) => setClientId(e.target.value)}
                                type='text'
                                className='mt-4 focus:outline-none focus:border-[#5AB3FF] border-1 border-solid bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                placeholder='Reddit client id'
                            />

                            <input
                                value={clientSecret} onChange={(e) => setClientSecret(e.target.value)}
                                type='password'
                                className='mt-4 focus:outline-none focus:border-[#5AB3FF] border-1 border-solid bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                placeholder='Reddit client secret'
                            />
                        </div>

                        <button
                            onClick={testConnection}
                            disabled={!username || !password || loading}
                            className='mt-6 rounded-md bg-[#6173ff] disabled:opacity-40 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        >
                            <div className='flex items-center'>
                                {
                                    loading ?
                                        <>
                                            <svg aria-hidden="true" className="w-5 h-5 mr-2 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            Testing connection
                                        </>
                                        :
                                        <span>Test connection</span>
                                }
                            </div>
                        </button>

                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    )
}
