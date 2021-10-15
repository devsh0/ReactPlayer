import React, {useEffect, useState} from 'react';
import Controller from "./components/Controller";
import './index.css';
import Filterpack from "./Filterpack";
import Equalizer from "./components/Equalizer";
import Visualizer from "./components/Visualizer";

const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const filterpack = new Filterpack(audioContext);
let stream = null;

export default function Player() {
    const [frequencyData, setFrequencyData] = useState();

    function getFrequencySamples(analyser) {
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 1;
        const freqPoints = analyser.frequencyBinCount;
        const data = new Uint8Array(freqPoints);
        analyser.getByteFrequencyData(data);
        return data;
    }

    function handleAudioLoaded(audioElement) {
        stream = audioContext.createMediaStreamSource(audioElement.captureStream());
        const inputNode = stream.connect(analyser);
        filterpack.connect(inputNode, audioContext.destination);
    }

    function handleAudioEnded() {
        stream.disconnect();
        analyser.disconnect();
        filterpack.disconnect();
    }

    function handleResume() {
        audioContext.resume().catch(error => console.log(error));
    }

    function handleDrawRequest() {
        const samples = getFrequencySamples(analyser);
        setFrequencyData(samples);
    }

    return (
        <div className={'player'}>
            <Visualizer frequencySamples={frequencyData} onDrawRequested={handleDrawRequest}/>
            <Controller onAudioLoaded={handleAudioLoaded} onAudioEnded={handleAudioEnded} onResume={handleResume}/>
            <Equalizer filterpack={filterpack}/>
        </div>
    );
}
