import React, {useState} from 'react';
import Controller from "./components/Controller";
import Filterpack from "./Filterpack";
import Visualizer from "./components/Visualizer";
import './index.css';
import Equalizer from "./components/Equalizer";

const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const filterpack = new Filterpack(audioContext);
let stream = null;

export default function Player() {
    const [paused, setPaused] = useState(true);

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


    return (
        <div className={'player'}>
            <Equalizer filterpack={filterpack}/>
            <Visualizer analyser={analyser} playing={!paused}/>
            <Controller onAudioLoaded={handleAudioLoaded} onAudioEnded={handleAudioEnded} onPause={handlePause} onResume={handleResume}/>
        </div>
    );
}
