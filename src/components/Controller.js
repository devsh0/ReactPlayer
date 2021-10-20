import React, {useContext, useRef} from "react";
import SeekSlider from "./SeekSlider";
import PlaybackController from "./PlaybackController";
import PlayerContext from "./PlayerContext";
import {PlayerView} from "./PlayerView";


export default function Controller(props) {
    const playerContext = useContext(PlayerContext);
    const elementRef = useRef();

    const handleAudioLoaded = () => {
        props.onAudioLoaded(elementRef.current);
    }

    const handleSeek = (newTime) => {
        elementRef.current.currentTime = newTime;
        props.onAudioSeeked(newTime);
    }

    const handlePlayPause = () => {
        if (playerContext.isPlaying) {
            elementRef.current.pause();
            props.onAudioPaused();
        } else {
            elementRef.current.play();
            props.onAudioResumed();
        }
    }

    const handlePlaybackProgress = (event) => {
        props.onAudioSeeked(event.target.currentTime);
    }

    return (
        <div className={'audio-controls-container'}>

            <audio ref={elementRef}
                   crossOrigin={'anonymous'}
                   src={'./biology.mp3'}
                   onEnded={props.onAudioUnloaded}
                   onCanPlay={handleAudioLoaded}
                   onTimeUpdate={handlePlaybackProgress}/>

            <SeekSlider onSeek={handleSeek} audioElement={elementRef.current}/>
            <PlaybackController onPlayPause={handlePlayPause} onViewSwitched={props.onViewSwitched}/>

        </div>
    )
}