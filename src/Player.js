import React, {useState} from 'react';
import Controller from "./components/Controller";
import './index.css';

// TODO: we will need a new context to share with Control component.
export default function Player() {
    const [audioContext, setAudioContext] = useState(new AudioContext());

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
    async function resetAudioContext(audioElement) {
        await audioContext.close();
        const context = new AudioContext();

        // Capture stream instead of binding directly to the HTMLAudioElement. Once bound to an AudioContext,
        // `HTMLAudioElement` does not allow rebinding to other AudioContexts even if the currently bound context
        // is properly disposed. Furthermore, an HTMLAudioElement can remain bounded to only one AudioContext at
        // any given time. See https://github.com/WebAudio/web-audio-api/issues/1202 for more info.
        const stream = audioElement.captureStream()
        const track = context.createMediaStreamSource(stream);
        const gainNode = context.createGain();
        gainNode.gain.value = 1;
        track.connect(gainNode).connect(context.destination);
        setAudioContext(context);
    }

    /*useEffect(() => {
        function animate() {
            const newSharedState = {...getCurrentSharedState()}
            newSharedState.position = audioElementRef.current.currentTime;
            updateSharedState(newSharedState, -1);
            requestAnimationFrame(animate);
        }

        audioElementRef.current.volume = .001;
        requestAnimationFrame(animate);
    }, []);*/
    return (<Controller onResume={resetAudioContext}/>);
}
