import React, {useEffect, useRef, useState} from "react";
import SeekSlider from "./SeekSlider";
import PlaybackController from "./PlaybackController";

const initialControllerState = {
    duration: 0,
    position: 0,
    playing: false,
    isEqView: false,
};


export default function Controller({onAudioLoaded, onAudioEnded, onPause, onResume, onViewSwitch}) {
    const audioElementRef = useRef();
    const [controllerState, setControllerState] = useState(initialControllerState);

    // Mutates the stream captured in `Player#audioContext`.
    const handleAudioLoaded = () => {
        const state = {...controllerState};
        state.duration = audioElementRef.current.duration;
        audioElementRef.current.volume = .001;
        setControllerState(state);
        onAudioLoaded(audioElementRef.current);
    }

    // Mutates the stream captured in `Player#audioContext`.
    const handleSeek = (newPosition) => {
        audioElementRef.current.currentTime = newPosition;
        const state = {...controllerState};
        state.position = newPosition;
        setControllerState(state);
    }

    const handleAudioEnded = () => {
        setControllerState(initialControllerState);
        onAudioEnded();
    }

    const handlePlayPause = () => {
        if (controllerState.playing) {
            audioElementRef.current.pause();
            onPause();
        }
        else {
            audioElementRef.current.play();
            onResume();
        }
        const state = {...controllerState};
        state.playing = !controllerState.playing;
        setControllerState(state);
    }

    const handlePlaybackProgress = (event) => {
        const state = {...controllerState};
        state.position = event.target.currentTime;
        setControllerState(state);
    }

    const handleViewSwitch = () => {
        controllerState.isEqView = !controllerState.isEqView;
        onViewSwitch();
    }
    return (
        <div className={'audio-controls-container'}>
            <audio ref={audioElementRef} src={'./biology.mp3'} onEnded={handleAudioEnded} onCanPlay={handleAudioLoaded} onTimeUpdate={handlePlaybackProgress}/>
            <SeekSlider controllerState={controllerState} onSeek={handleSeek} audioElement={audioElementRef.current}/>
            <PlaybackController onPlayPause={handlePlayPause} controllerState={controllerState} onViewSwitch={handleViewSwitch}/>
        </div>
    )
}