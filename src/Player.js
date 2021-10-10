import React, {useEffect, useRef, useState} from 'react';
import PlayerContext from "./components/PlayerContext";
import Controls from "./components/Controls";
import './index.css';

export default function Player() {
    const audioElementRef = useRef();
    const sharedStateRef = useRef();
    const audioContextRef = useRef(null);

    // WebAudio does not expose any API to seek over the media buffer, so we offload seeking to `handleSetPosition`.
    // `handleSetPosition` implements seeking by changing the `HTMLAudioElement.value` property and then invokes this
    // function to dispose the current AudioContext and cook up a new one. This is required to keep AudioContext
    // and HTMLAudioElement in sync.
    function resetAudioContext() {
        if (audioContextRef.current !== null) {
            audioContextRef.current.close();
        }
        audioContextRef.current = new AudioContext();
        const audioContext = audioContextRef.current;

        // Capture stream instead of binding directly to the HTMLAudioElement. Once bound to an AudioContext,
        // the chain between the context and the element doesn't break even when the context is destroyed.
        // Furthermore, an HTMLAudioElement can remain bounded to only one AudioContext at any given time.
        // See https://github.com/WebAudio/web-audio-api/issues/1202 for more info.
        const stream = audioElementRef.current.captureStream()
        const track = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1;
        track.connect(gainNode);
        gainNode.connect(audioContext.destination);
        return audioContext;
    }

    let [sharedState, setSharedState] = useState({
        duration: 0,
        position: 0,
        playing: false
    })

    // If `newPosition` is specified, we infer that seeking is intended.
    const updateSharedState = (newSharedState, newPosition = -1) => {
        if (newPosition >= 0) {
            audioElementRef.current.currentTime = newPosition;
            newSharedState.position = newPosition;
        }
        sharedState = newSharedState;
        setSharedState(newSharedState);
        sharedStateRef.current = newSharedState;
    }

    useEffect(() => {
        function animate() {
            const newSharedState = {...(sharedStateRef.current)}
            newSharedState.position = audioElementRef.current.currentTime;
            updateSharedState(newSharedState);
            requestAnimationFrame(animate);
        }

        audioElementRef.current.volume = .001;
        requestAnimationFrame(animate);
    }, []);

    const resume = () => {
        // Resuming playing using the existing context fails sometimes.
        // Let's just create a new one.
        resetAudioContext();
        audioElementRef.current.play();
    }

    const pause = () => {
        audioElementRef.current.pause();
        audioContextRef.current.suspend();
    }

    const handlePlayPause = () => {
        const newSharedState = {...sharedState};
        if (sharedState.playing) {
            pause();
            newSharedState.playing = false;
            updateSharedState(newSharedState);
        } else {
            resume();
            newSharedState.playing = true;
            updateSharedState(newSharedState);
        }
    }

    const handleAudioMetadataLoaded = () => {
        const newSharedState = {...sharedState};
        newSharedState.duration = audioElementRef.current.duration;
        newSharedState.position = audioElementRef.current.currentTime;
        updateSharedState(newSharedState)
        resetAudioContext();
    }

    const handleSetPosition = (newPosition) => {
        const newSharedState = {...sharedState};
        updateSharedState(newSharedState, newPosition)
        resetAudioContext();
    }

    const handleSongEnded = () => {
        const newSharedState = {...sharedState}
        newSharedState.playing = false;
        updateSharedState(newSharedState, 0);
        resetAudioContext();
    }

    const sharedContext = {sharedState, handleSetPosition, handlePlayPause}
    return (
        <PlayerContext.Provider value={sharedContext}>
            <audio ref={audioElementRef} src={'./kda.mp3'}
                   onEnded={handleSongEnded}
                   preload={'metadata'}
                   onLoadedMetadata={handleAudioMetadataLoaded}/>
            <Controls />
        </PlayerContext.Provider>
    );
}
