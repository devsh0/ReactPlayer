import React, {useEffect, useRef, useState} from 'react';
import PlayerContext from "./components/PlayerContext";
import Controls from "./components/Controls";
import './index.css';

export default function Player() {
    const audioElementRef = useRef();

    const [sharedState, setSharedState] = useState({
        duration: 0,
        position: 0,
        playing: false,
    })

    const handleTogglePlayPause = () => {
        const newSharedState = {...sharedState};
        if (sharedState.playing) {
            audioElementRef.current.pause();
            newSharedState.playing = false;
            setSharedState(newSharedState);
        } else {
            audioElementRef.current.play();
            newSharedState.playing = true;
            setSharedState(newSharedState);
        }
    }

    const handleAudioMetadataLoaded = () => {
        const newShared = {...sharedState};
        newShared.duration = audioElementRef.current.duration;
        newShared.position = audioElementRef.current.currentTime;
        setSharedState(newShared);
    }

    const handleSetPosition = (newPosition) => {
        audioElementRef.current.currentTime = newPosition;
        const newSharedState = {...sharedState};
        newSharedState.position = newPosition;
        setSharedState(newSharedState);
    }

    const sharedContext = {sharedState, handleSetPosition}
    return (
        <PlayerContext.Provider value={sharedContext}>
            <audio ref={audioElementRef} src={'./kda.mp3'} preload={'metadata'} onLoadedMetadata={handleAudioMetadataLoaded}/>
            <Controls togglePlayPause={handleTogglePlayPause}/>
        </PlayerContext.Provider>
    );
}