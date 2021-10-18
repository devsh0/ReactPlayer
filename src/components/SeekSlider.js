import {useContext, useEffect, useRef, useState} from "react";
import PlayerContext from "./PlayerContext";

export default function SeekSlider({onSeek}) {
    const playerContext = useContext(PlayerContext);
    const overlay = useRef();
    const inputRef = useRef();

    useEffect(() => {
        if (playerContext.currentTime === 0) {
            overlay.current.style.width = 0;
            return;
        }
        const newWidth = (inputRef.current.clientWidth / (playerContext.audioDuration / playerContext.currentTime)) + 1;
        overlay.current.style.width = newWidth + 'px';
    }, [playerContext.currentTime])

    return (
        <div className={'seek-slider-container'}>
            <div ref={overlay} className={'played-segment'}></div>
            <input ref={inputRef} className={'progress'}
                   type='range' max={playerContext.audioDuration} step='1'
                   value={playerContext.currentTime}
                   onChange={event => onSeek(event.target.value)}/>
        </div>
    );
}