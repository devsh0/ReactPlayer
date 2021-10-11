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

    // Mutates the stream captured in `Player.audioContext`.
    const handleAudioLoaded = () => {
        // TODO: do we need to create a sharedSateRef?
        const state = {...controllerState};
        state.duration = audioElementRef.current.duration;
        setControllerState(state);
        audioElementRef.current.volume = .001;
        onStreamMutated(audioElementRef.current);
    }

    // Mutates the stream captured in `Player.audioContext`.
    const handleSetPosition = (newPosition) => {
        // TODO: do we need to create a sharedSateRef?
        audioElementRef.current.currentTime = newPosition;
        const state = {...controllerState};
        state.position = newPosition;
        setControllerState(state);
        onStreamMutated(audioElementRef.current);
    }

    const handleAudioEnded = () => {
        // TODO: do we need to create a sharedSateRef?
        setControllerState(initialControllerState);
    }

    const resume = () => {
        // fixme: we need to reset AudioContext here.
        // fixme: note that newly created context won't immediately be available.
        audioElementRef.current.play();
    }

    const pause = () => {
        audioElementRef.current.pause();
    }

    const handlePlayPause = () => {
        const state = {...controllerState};
        if (controllerState.playing) {
            pause();
            state.playing = false;
            setControllerState(state);
        } else {
            resume();
            state.playing = true;
            setControllerState(state);
        }
    }

    return (
        <div id={'audio-controls-container'}>
            <audio ref={audioElementRef} src={'./kda.mp3'}
                   onEnded={handleAudioEnded}
                   onCanPlay={handleAudioLoaded}
                   preload={'metadata'}/>

            {/* FIXME: We're assuming that we will always supply latest state because every state change triggers */}
            {/* a re-render of Controller and that should re-render SeekSlider with the latest controller state */}
            <SeekSlider controllerState={controllerState} onSetPosition={handleSetPosition}/>
            <button onClick={handlePlayPause}>{controllerState.playing ? 'Pause' : 'Play'}</button>
        </div>
    )
}