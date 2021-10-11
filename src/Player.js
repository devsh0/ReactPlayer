import React, {useEffect, useRef, useState} from 'react';
import PlayerContext from "./components/PlayerContext";
import Controls from "./components/Controls";
import './index.css';

export default function Player() {
    const audioElementRef = useRef();
    const sharedStateRef = useRef();
    const audioContextRef = useRef(null);

    // WebAudio does not expose any API to seek over the media buffer, so we offload seeking to `HTMLAudioElement`.
    // `handleSetPosition` implements seeking by changing the `HTMLAudioElement.value` property. This is a nasty
    // hack because we're allowing playback to be controlled by both: the `HTMLAudioElement` and AudioContext.
    // Distributing playback control among two separate components like this creates problems sometimes.
    // When both players are suspended (paused) and a `Play` request's been issued, both would wake up and race to
    // take control over playback. If AudioContext succeeds, we're in luck. If not, then occasionally AudioContext
    // is entirely suppressed and all we hear is the mild output from `HTMLAudioElement.play`. To get around this
    // issue, whenever there is a possibility of AudioContext getting dominated by `HTMLAudioElement`, we dispose
    // the current AudioContext and cook up a new one. `resetAudioContext` is a helper to clean up the current
    // AudioContext and prepare a new one. I don't know why this reincarnation of AudioContext solves the problem,
    // but it does seem to solve it.

    // Ideally, we would want the AudioContext to have exclusive control over playback. But as mentioned, we can't
    // implement seeking with that approach.
    function resetAudioContext() {
        if (audioContextRef.current !== null) {
            audioContextRef.current.close();
        }
        audioContextRef.current = new AudioContext();
        const audioContext = audioContextRef.current;

        // Capture stream instead of binding directly to the HTMLAudioElement. Once bound to an AudioContext,
        // `HTMLAudioElement` does not allow rebinding to other AudioContexts even if the currently bound context
        // is properly disposed. Furthermore, an HTMLAudioElement can remain bounded to only one AudioContext at
        // any given time. See https://github.com/WebAudio/web-audio-api/issues/1202 for more info.
        const stream = audioElementRef.current.captureStream()
        const track = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1;
        track.connect(gainNode);
        gainNode.connect(audioContext.destination);
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
        // Resuming playback using the existing context fails sometimes.
        // Let's just create a new one.
        resetAudioContext();
        audioContextRef.current.resume();
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
    }

    const handleAudioEnded = () => {
        const newSharedState = {...sharedState}
        newSharedState.playing = false;
        updateSharedState(newSharedState, 0);
    }

    const sharedContext = {sharedState, handleSetPosition, handlePlayPause}
    return (
        <PlayerContext.Provider value={sharedContext}>
            <audio ref={audioElementRef} src={'./kda.mp3'}
                   onEnded={handleAudioEnded}
                   preload={'metadata'}
                   onLoadedMetadata={handleAudioMetadataLoaded}/>
            <Controls />
        </PlayerContext.Provider>
    );
}
