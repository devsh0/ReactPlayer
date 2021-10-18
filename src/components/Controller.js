import React, {useContext, useRef} from "react";
import SeekSlider from "./SeekSlider";
import PlaybackController from "./PlaybackController";
import PlayerContext from "./PlayerContext";
import {PlayerView} from "./PlayerView";


export default function Controller(props) {
    const playerContext = useContext(PlayerContext);
    const elementRef = useRef();
    const eqViewRef = useRef(false);

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

    // Fixme: this should be removed when playlist is added.
    const handleViewSwitched = () => {
        props.onViewSwitched(eqViewRef.current ? PlayerView.Visualizer : PlayerView.Equalizer);
        eqViewRef.current = !eqViewRef.current;
    }

    return (
        <div className={'audio-controls-container'}>

            <audio ref={elementRef} src={'./biology.mp3'}
                   onEnded={props.onAudioUnloaded}
                   onCanPlay={handleAudioLoaded}
                   onTimeUpdate={handlePlaybackProgress}/>

            <SeekSlider onSeek={handleSeek} audioElement={elementRef.current}/>
            <PlaybackController onPlayPause={handlePlayPause} onViewSwitched={handleViewSwitched}/>

        </div>
    )
}