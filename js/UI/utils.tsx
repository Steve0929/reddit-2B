import { COLORS, NEW, VIDEO_STATUS } from "./constants";
import React from "react";

export const getIdFromUrl = (url: string) => {
    const id = url.split('/')[6]
    return id || null;
}

export const getUrlForNewVideo = () => {
    return `/app/${btoa(NEW)}`;
}

export const getCredentialStatusBadge = (credentialsReady: boolean | null) => {
    return credentialsReady ? <span className='text-[#51dd30]'>Ready</span> : <span className='text-[#ffc107]'>Pending</span>
}

export const statusToBadge = (status: string) => {
    VIDEO_STATUS
    const mapping = {
        [VIDEO_STATUS.COMPLETED]: COLORS.GREEN,
        [VIDEO_STATUS.INPROCESS]: COLORS.YELLOW,
        [VIDEO_STATUS.FAILED]: COLORS.RED,
    };
    const color = mapping[status];
    return <div className={`flex rounded-lg p-1 px-2 text-xs w-fit`} style={{ color: color, border: `2px solid ${color}` }}> {status} </div >
}