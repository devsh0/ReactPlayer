import React, {useRef, useState} from "react";
import SeekSlider from "./SeekSlider";

const initialControllerState = {
    duration: 0,
    position: 0,
    playing: false
};

export default function Controller({onStreamMutated}) {
    const audioElementRef = useRef();
    const [controllerState, setControllerState] = useState(initialControllerState);

    // Mutates the stream captured in `Player#audioContext`.
    const handleAudioLoaded = () => {
        const state = {...controllerState};
        state.duration = audioElementRef.current.duration;
        setControllerState(state);
        audioElementRef.current.volume = .001;
        onStreamMutated(audioElementRef.current);
    }

    // Mutates the stream captured in `Player#audioContext`.
    const handleSeek = (newPosition) => {
        audioElementRef.current.currentTime = newPosition;
        const state = {...controllerState};
        state.position = newPosition;
        setControllerState(state);
        onStreamMutated(audioElementRef.current);
    }

    const handleAudioEnded = () => {
        setControllerState(initialControllerState);
    }

    const handlePlayPause = () => {
        if (controllerState.playing)
            audioElementRef.current.pause();
        else audioElementRef.current.play();
        const state = {...controllerState};
        state.playing = !controllerState.playing;
        setControllerState(state);
    }

    const handlePlaybackProgress = (event) => {
        const state = {...controllerState};
        state.position = event.target.currentTime;
        setControllerState(state);
    }

    return (
        <div id={'audio-controls-container'}>
            <audio ref={audioElementRef} src={'./kda.mp3'} onEnded={handleAudioEnded} onCanPlay={handleAudioLoaded} onTimeUpdate={handlePlaybackProgress}/>
            <SeekSlider controllerState={controllerState} onSeek={handleSeek} audioElement={audioElementRef.current}/>
            <button onClick={handlePlayPause}>{controllerState.playing ? 'Pause' : 'Play'}</button>
        </div>
    )
}