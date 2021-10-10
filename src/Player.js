import React, {useEffect, useRef, useState} from 'react';
import PlayerContext from "./components/PlayerContext";
import Controls from "./components/Controls";
import './index.css';

export default function Player() {
    const audioElementRef = useRef();
    const sharedStateRef = useRef();

    const [sharedState, setSharedState] = useState({
        duration: 0,
        position: 0,
        playing: false,
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

    const handleTogglePlayPause = () => {
        const newSharedState = {...sharedState};
        if (sharedState.playing) {
            audioElementRef.current.pause();
            newSharedState.playing = false;
            updateSharedState(newSharedState);
        } else {
            audioElementRef.current.play();
            newSharedState.playing = true;
            updateSharedState(newSharedState);
        }
    }

    const handleAudioMetadataLoaded = () => {
        const newSharedState = {...sharedState};
        newSharedState.duration = audioElementRef.current.duration;
        newSharedState.position = audioElementRef.current.currentTime;
        updateSharedState(newSharedState)
    }

    const handleSetPosition = (newPosition) => {
        audioElementRef.current.currentTime = newPosition;
        const newSharedState = {...sharedState};
        newSharedState.position = newPosition;
        updateSharedState(newSharedState);
    }

    const sharedContext = {sharedState, handleSetPosition}
    return (
        <PlayerContext.Provider value={sharedContext}>
            <audio ref={audioElementRef} src={'./kda.mp3'} preload={'metadata'}
                   onLoadedMetadata={handleAudioMetadataLoaded}/>
            <Controls togglePlayPause={handleTogglePlayPause}/>
        </PlayerContext.Provider>
    );
}
