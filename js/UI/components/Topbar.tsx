import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { getUrlForNewVideo } from '../utils';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'App', href: getUrlForNewVideo() },
];


export const Topbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <div className='px-6 pt-6 lg:px-0'>
            <nav
                className='flex items-center justify-between items-center'
                aria-label='Global'
            >
                <div className='flex w-fit mr-4'>
                    <a href='/' className='m-1.5 p-1.5'>
                        <h1 className='text-2xl font-semibold'>Reddit 2B</h1>
                    </a>
                </div>
                <div className='flex lg:hidden'>
                    <button
                        type='button'
                        className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className='sr-only'>Open main menu</span>
                        <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                    </button>
                </div>
                <div className='hidden lg:flex lg:gap-x-8 '>
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className='text-md font-semibold leading-6 text-gray-900'
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
                <div className='hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-8'>
                    <div className='gummy flex items-center px-2 py-1 relative rounded-xl bg-white bg-opacity-70  text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20'>
                        <Image
                            src="/gh.png"
                            width={30}
                            height={30}
                            alt="logo"
                            className='m-auto mr-1 '
                        />
                        <span className='mr-1'> Star on</span>
                        <a
                            href='https://github.com/Steve0929/reddit-2B'
                            className='font-semibold text-black-600'
                            target='_blank'
                            rel='noreferrer'
                        >
                            <span className='absolute inset-0' aria-hidden='true' />
                            GitHub <span aria-hidden='true'>⭐️</span>
                        </a>
                    </div>
                </div>
            </nav>
            <Dialog as='div' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <Dialog.Panel className='fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden'>
                    <div className='flex items-center justify-between'>
                        <a href='#' className='-m-1.5 p-1.5'>
                            <h1 className='text-xl font-semibold'>Reddit 2B</h1>
                        </a>
                        <button
                            type='button'
                            className='-m-2.5 rounded-md p-2.5 text-gray-700'
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className='sr-only'>Close menu</span>
                            <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                        </button>
                    </div>
                    <div className='mt-6 flow-root'>
                        <div className='-my-6 divide-y divide-gray-500/10'>
                            <div className='space-y-2 py-6'>
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className='-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10'
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className='py-6'>
                                <div className='flex items-center w-fit relative rounded-xl bg-white bg-opacity-70 py-1 px-2 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20'>
                                    <Image
                                        src="/gh.png"
                                        width={30}
                                        height={30}
                                        alt="logo"
                                        className='m-auto mr-1'
                                    />
                                    <span className='mr-1'> Star on</span>
                                    <a
                                        href='https://github.com/Steve0929/reddit-2B'
                                        className='font-semibold text-black-600'
                                        target='_blank'
                                        rel='noreferrer'
                                    >
                                        <span className='absolute inset-0' aria-hidden='true' />
                                        GitHub <span aria-hidden='true'>⭐️</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    )
}
