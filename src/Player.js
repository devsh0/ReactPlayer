import React, {useEffect, useState} from 'react';
import Controller from "./components/Controller";
import './index.css';

const audioContext = new AudioContext();
let audioElement = null;

// TODO: we will need a new context to share with Control component.
export default function Player() {
    const [observer, setAudioContext] = useState(false);

    useEffect(() => {
        console.log('Re-rendered');
        if (audioElement)
            configureAudioContext(audioElement);
    });

    function configureAudioContext(audioElement) {
        console.log(audioContext);
        const stream = audioContext.createMediaStreamSource(audioElement.captureStream());
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1;
        stream.connect(gainNode).connect(audioContext.destination);
    }

    function handleStreamMutation(audioEl) {
        audioElement = audioEl;
        setAudioContext({observer: !observer});
    }

    return (<Controller onStreamMutated={handleStreamMutation}/>);
}
