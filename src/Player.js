import React, {useEffect, useRef, useState} from 'react';
import PlayerContext from "./components/PlayerContext";
import Controls from "./components/Controls";
import './index.css';

export default function Player() {
    const audioElementRef = useRef();
    const sharedStateRef = useRef();
    const audioContextRef = useRef(null);

    // WebAudio does not expose any API to seek over the media buffer, so we offload seeking to `handleSetPosition`.
    // `handleSetPosition` implements seeking by changing `HTMLAudioElement.value` property and then invokes this
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
        // Furthermore, an HTMLAudioElement can remain bound to only a single AudioContext at any given time.
        // See https://github.com/WebAudio/web-audio-api/issues/1202 for more info.
        const stream = audioElementRef.current.captureStream()
        const track = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0;
        track.connect(gainNode);
        gainNode.connect(audioContext.destination);
        return audioContext;
    }

    const [sharedState, setSharedState] = useState({
        duration: 0,
        position: 0,
        playing: false
    })

    const updateSharedState = (newSharedState) => {
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

        requestAnimationFrame(animate);
    }, []);

    const resume = () => {
        audioContextRef.current.resume();
        audioElementRef.current.play();
    }

    const pause = () => {
        audioContextRef.current.suspend();
        audioElementRef.current.pause();
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
        audioElementRef.current.currentTime = newPosition;
        const newSharedState = {...sharedState};
        newSharedState.position = newPosition;
        updateSharedState(newSharedState)
        resetAudioContext();
    }

    const handleSongEnded = () => {
        const newSharedState = {...sharedState}
        newSharedState.duration = 0;
        newSharedState.position = 0;
        newSharedState.playing = false;
        updateSharedState(newSharedState);
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
