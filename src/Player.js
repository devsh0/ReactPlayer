import React, {useRef, useState} from 'react';
import PlayerContext from "./components/PlayerContext";
import Controls from "./components/Controls";
import './index.css';

export default function Player() {
    const audioElementRef = useRef();
    const context = new AudioContext();

    const [sharedState, setSharedState] = useState({
        duration: 0,
        currentTime: 0,
        playing: false,
    })

    const handleTogglePlayPause = () => {
        if (sharedState.playing) {
            audioElementRef.current.pause();
            setSharedState({playing: false});
        } else {
            audioElementRef.current.play();
            setSharedState({playing: true});
        }
    }

    return (
        <PlayerContext.Provider value={sharedState}>
            <audio ref={audioElementRef} src={'./kda.mp3'}/>
            <Controls togglePlayPause={handleTogglePlayPause}/>
        </PlayerContext.Provider>
    );
}