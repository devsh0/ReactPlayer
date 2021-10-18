import React, {useState} from 'react';
import Controller from "./components/Controller";
import Filterpack from "./Filterpack";
import Visualizer from "./components/Visualizer";
import Equalizer from "./components/Equalizer";
import PlayerContext from "./components/PlayerContext";
import {PlayerView} from "./components/PlayerView";

import './index.css';

let _INITIAL_STATE_ = null;

const init = () => {
    if (_INITIAL_STATE_) return _INITIAL_STATE_;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const filterpack = new Filterpack(audioContext);

    _INITIAL_STATE_ = {
        audioContext: audioContext,
        audioStreamNode: null,
        analyserNode: analyser,
        filterpackNode: filterpack,
        destinationNode: audioContext.destination,
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

    function loadAudioFromElement(audioElement) {
        const state = {...playerState};
        state.audioStreamNode = state.audioContext.createMediaStreamSource(audioElement.captureStream());
        state.filterpackNode.connect(state.audioStreamNode, state.analyserNode);
        state.analyserNode.connect(state.destinationNode);
        state.audioDuration = audioElement.duration;
        audioElement.volume = 0.001;
        setPlayerState(state);
    }

    function unloadAudio() {
        const state = {...playerState};
        state.audioStreamNode.disconnect();
        state.audioDuration = 0;
        state.currentTime = 0;
        state.isPlaying = false;
        setPlayerState(state);
    }

    function handleAudioLoaded(audioElement) {
        loadAudioFromElement(audioElement);
    }

    function handleAudioUnloaded() {
        unloadAudio();
    }

    function handleAudioPaused() {
        const state = {...playerState};
        state.isPlaying = false;
        setPlayerState(state);
    }

    function handleAudioResumed() {
        const state = {...playerState};
        // Logging does it for now.
        state.audioContext.resume().catch(error => console.log(error));
        state.isPlaying = true;
        setPlayerState(state);
    }

    function handleAudioSeeked(newTime) {
        const state = {...playerState};
        state.currentTime = newTime;
        setPlayerState(state);
    }

    function handleViewSwitched(view) {
        const state = {...playerState};
        state.currentView = view;
        setPlayerState(state);
    }

    function handlePresetChanged(key) {
        const state = {...playerState};
        state.equalizer.currentPreset = state.filterpackNode.getPreset(key);
        state.filterpackNode.setCurrentPreset(key);
        setPlayerState(state);
    }

    function handleFilterTuned(index, newGain) {
        const state = {...playerState};
        const filter = state.filterpackNode.getFilters()[index];
        filter.setGain(newGain);
        state.filterpackNode.commitCustomPreset();
        // Manually trigger a `presetChanged` so that tampering with the bands does not
        // result in modification of gain profile of any preset other than `Custom`'s.
        handlePresetChanged('custom');
    }

    function handleEqToggleRequested() {
        const state = {...playerState};
        state.equalizer.isEnabled = !state.equalizer.isEnabled;
        state.filterpackNode.setEnabled(state.equalizer.isEnabled);
        setPlayerState(state);
    }

    function handleEqResetRequested() {
        const state = {...playerState};
        state.filterpackNode.reset();
        handlePresetChanged('custom');
    }

    const eqActive = playerState.currentView === PlayerView.Equalizer;
    return (
        <PlayerContext.Provider value={playerState}>
            <div className={'player'}>
                {eqActive ? <Equalizer onPresetChanged={handlePresetChanged}
                                       onFilterTuned={handleFilterTuned}
                                       onEqToggleRequested={handleEqToggleRequested}
                                       onEqResetRequested={handleEqResetRequested}/>
                    : <Visualizer/>}

                <Controller onAudioLoaded={handleAudioLoaded}
                            onAudioUnloaded={handleAudioUnloaded}
                            onAudioPaused={handleAudioPaused}
                            onAudioResumed={handleAudioResumed}
                            onViewSwitched={handleViewSwitched}
                            onAudioSeeked={handleAudioSeeked}/>
            </div>
        </PlayerContext.Provider>
    );
}
