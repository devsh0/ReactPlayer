import React, {useEffect, useRef, useState} from 'react';
import Controller from "./components/Controller";
import VisualizerView from "./components/VisualizerView";
import EqualizerView from "./components/EqualizerView";
import PlaylistView from "./components/PlaylistView";
import Filterpack from "./Filterpack";
import Session from "./components/Session";
import PlayerContext from "./components/PlayerContext";
import {PlayerView} from "./components/PlayerView";
import {fileToMediaResource} from "./components/Utils";
import './index.css';

let _INITIAL_STATE_ = null;

const init = () => {
    if (_INITIAL_STATE_) return _INITIAL_STATE_;

    const audioEl = new Audio();
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const filterpack = new Filterpack(audioContext);

    _INITIAL_STATE_ = {
        audioElement: audioEl,
        audioContext: audioContext,
        audioStreamNode: null,
        analyserNode: analyser,
        filterpackNode: filterpack,
        destinationNode: audioContext.destination,
        session: new Session(audioEl),
        audioDuration: 0,
        currentTime: 0,
        isPlaying: false,
        currentView: PlayerView.Visualizer,
        equalizer: {
            isEnabled: filterpack.isEnabled(),
            currentPreset: filterpack.getCurrentPreset()
        }
    }

    return _INITIAL_STATE_;
}

export default function Player() {
    const [playerState, setPlayerState] = useState(init());
    const stateRef = useRef(playerState);


    useEffect(() => {
        const audioEl = playerState.audioElement;
        const session = playerState.session;

        audioEl.crossOrigin = 'anonymous';
        audioEl.addEventListener('canplay', handleAudioCanPlay);
        audioEl.addEventListener('ended', handleAudioEnded);
        audioEl.addEventListener('timeupdate', handlePlaybackProgressed);

        function loadMedia() {
            async function fetchMedia(url) {
                const response = await fetch(url);
                const data = await response.blob();
                return new File([data], "biology.mp3", {type: 'audio/mp3'});
            }

            fetchMedia('http://localhost:3000/kda.mp3').then((file) => {
                fileToMediaResource([file]).then((mediaResources) => {
                    mediaResources.forEach(resource => session.enqueueMedia(resource));
                    session.loadNext();
                }).catch((error) => console.log(error.message))
            });
        }

        // Load a few audio files from server.
        loadMedia();
    }, [])

    function updateState(state) {
        stateRef.current = state;
        setPlayerState(stateRef.current);
    }

    function loadAudioFromElement() {
        const state = {...stateRef.current};
        const audioElement = state.audioElement;
        state.audioStreamNode = state.audioContext.createMediaStreamSource(audioElement.captureStream());
        state.filterpackNode.connect(state.audioStreamNode, state.analyserNode);
        state.analyserNode.connect(state.destinationNode);
        state.audioDuration = audioElement.duration;
        audioElement.volume = 0.001;
        updateState(state);
    }

    function unloadAudio() {
        const state = {...stateRef.current};
        state.audioStreamNode.disconnect();
        state.audioDuration = 0;
        state.currentTime = 0;
        state.isPlaying = false;
        stateRef.current = state;
        updateState(state);
    }

    function handleAudioCanPlay() {
        loadAudioFromElement();
    }

    function handleAudioEnded() {
        unloadAudio();
    }

    function handleAudioPaused() {
        const state = {...stateRef.current};
        state.audioElement.pause();
        state.isPlaying = false;
        stateRef.current = state;
        updateState(state);
    }

    function handleAudioResumed() {
        const state = {...stateRef.current};
        state.audioElement.play();
        // Logging does it for now.
        state.audioContext.resume().catch(error => console.log(error));
        state.isPlaying = true;
        stateRef.current = state;
        updateState(state);
    }

    function handlePlaybackProgressed() {
        const state = {...stateRef.current};
        state.currentTime = state.audioElement.currentTime;
        stateRef.current = state;
        updateState(state);
    }

    function handleAudioSeeked(newTime) {
        const state = {...stateRef.current};
        state.audioElement.currentTime = newTime;
        state.currentTime = newTime;
        stateRef.current = state;
        updateState(state);
    }

    function handleViewSwitched(view) {
        const state = {...stateRef.current};
        state.currentView = view;
        stateRef.current = state;
        updateState(state);
    }

    function handlePresetChanged(key) {
        const state = {...stateRef.current};
        state.equalizer.currentPreset = state.filterpackNode.getPreset(key);
        state.filterpackNode.setCurrentPreset(key);
        stateRef.current = state;
        updateState(state);
    }

    function handleFilterTuned(index, newGain) {
        const state = {...stateRef.current};
        const filter = state.filterpackNode.getFilters()[index];
        filter.setGain(newGain);
        state.filterpackNode.commitCustomPreset();
        // Manually trigger a `presetChanged` so that tampering with the bands does not
        // result in modification of gain profile of any preset other than `Custom`'s.
        handlePresetChanged('custom');
    }

    function handleEqToggleRequested() {
        const state = {...stateRef.current};
        state.equalizer.isEnabled = !state.equalizer.isEnabled;
        state.filterpackNode.setEnabled(state.equalizer.isEnabled);
        stateRef.current = state;
        setPlayerState(state);
    }

    function handleEqResetRequested() {
        const state = {...stateRef.current};
        state.filterpackNode.reset();
        handlePresetChanged('custom');
    }

    function getView() {
        switch (playerState.currentView) {
            case PlayerView.Equalizer:
                return (<EqualizerView onPresetChanged={handlePresetChanged}
                                       onFilterTuned={handleFilterTuned}
                                       onEqToggleRequested={handleEqToggleRequested}
                                       onEqResetRequested={handleEqResetRequested}/>);
            case PlayerView.Playlist:
                return (<PlaylistView/>)
            default:
                return <VisualizerView/>
        }
    }

    return (
        <PlayerContext.Provider value={playerState}>
            <div className={'player'}>
                {getView()}
                <Controller onAudioPaused={handleAudioPaused}
                            onAudioResumed={handleAudioResumed}
                            onViewSwitched={handleViewSwitched}
                            onAudioSeeked={handleAudioSeeked}/>
            </div>
        </PlayerContext.Provider>
    );
}
