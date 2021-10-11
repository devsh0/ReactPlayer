import React, {useEffect, useState} from 'react';
import Controller from "./components/Controller";
import './index.css';

const audioContext = new AudioContext();
let audioElement = null;

export default function Player() {
    const [observer, setAudioContext] = useState(false);

    useEffect(() => {
        if (audioElement)
            configureAudioContext(audioElement);
    });

    function configureAudioContext(audioElement) {
        const stream = audioContext.createMediaStreamSource(audioElement.captureStream());
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1;
        stream.connect(gainNode).connect(audioContext.destination);
    }

    function handleStreamMutation(audioEl) {
        audioElement = audioEl;
        // How else would I invoke a re-render?
        setAudioContext({observer: !observer});
    }

    return (<Controller onStreamMutated={handleStreamMutation}/>);
}
