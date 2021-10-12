import React, {useEffect, useState} from 'react';
import Controller from "./components/Controller";
import './index.css';
import Filterpack from "./Filterpack";
import Equalizer from "./components/Equalizer";

const audioContext = new AudioContext();
const filterpack = new Filterpack(audioContext);
let audioElement = null;

export default function Player() {
    const [observer, setAudioContext] = useState(false);

    useEffect(() => {
        if (audioElement)
            configureAudioContext(audioElement);
    });

    function configureAudioContext(audioElement) {
        const stream = audioContext.createMediaStreamSource(audioElement.captureStream());
        filterpack.connect(stream, audioContext.destination);
    }

    function handleStreamMutation(audioEl) {
        audioElement = audioEl;
        // How else would I invoke a re-render?
        setAudioContext({observer: !observer});
    }

    function handleResume() {
        audioContext.resume().catch(error => console.log(error));
    }

    return (
        <div>
            <Controller onStreamMutated={handleStreamMutation} onResume={handleResume}/>
            <Equalizer filterpack={filterpack}/>
        </div>
    );
}
