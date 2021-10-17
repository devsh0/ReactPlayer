import React, {useState} from 'react';
import Controller from "./components/Controller";
import Filterpack from "./Filterpack";
import Visualizer from "./components/Visualizer";
import Equalizer from "./components/Equalizer";
import './index.css';

const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const filterpack = new Filterpack(audioContext);
let stream = null;

export default function Player() {
    const [paused, setPaused] = useState(true);
    const [eqActive, setEqActive] = useState(false);

    function handleAudioLoaded(audioElement) {
        stream = audioContext.createMediaStreamSource(audioElement.captureStream());
        filterpack.connect(stream, analyser);
        analyser.connect(audioContext.destination);
    }

    function handleAudioEnded() {
        stream.disconnect();
        analyser.disconnect();
        filterpack.disconnect();
    }

    function handlePause() {
        setPaused(true);
    }

    function handleResume() {
        audioContext.resume().catch(error => console.log(error));
        setPaused(false);
    }

    function handleViewSwitch() {
        setEqActive(!eqActive);
    }

    return (
        <div className={'player'}>
            {eqActive ? <Equalizer filterpack={filterpack} isActive={eqActive}/> : <Visualizer analyser={analyser} playing={!paused} isActive={!eqActive}/>}
            <Controller onAudioLoaded={handleAudioLoaded} onAudioEnded={handleAudioEnded} onPause={handlePause} onResume={handleResume}/>
            <button onClick={handleViewSwitch}>Activate EQ</button>
        </div>
    );
}
