import React, {useEffect, useRef, useState} from 'react';
import Controller from "./Controller";
import VisualizerView from "./VisualizerView";
import EqualizerView from "./EqualizerView";
import PlaylistView from "./PlaylistView";
import Filterpack from "./Filterpack";
import Session from "./Session";
import PlayerContext from "./PlayerContext";
import {PlayerView} from "./PlayerView";
import {fileToMediaResource} from "./Utils";
import '../index.css';

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
        session: null,
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
    playerState.session = playerState.session === null
        ? new Session(playerState.audioElement, handleSessionUpdated, triggerPlay, triggerPlaybackReset)
        : playerState.session;
    const stateRef = useRef(playerState);


    useEffect(() => {
        const state = playerState;
        const audioEl = state.audioElement;
        state.audioStreamNode = state.audioContext.createMediaElementSource(audioEl);
        state.filterpackNode.connect(state.audioStreamNode, state.analyserNode);
        state.analyserNode.connect(state.destinationNode);

        audioEl.crossOrigin = 'anonymous';
        audioEl.addEventListener('canplay', handleAudioCanPlay);
        audioEl.addEventListener('ended', handleAudioEnded);
        audioEl.addEventListener('timeupdate', handlePlaybackProgressed);

        // Load a few static audio files from server.
        function loadMedia() {
            const session = playerState.session;

            async function fetchMedia(url) {
                const name = url.slice(2);
                const response = await fetch(url);
                const data = await response.blob();
                return new File([data], name, {type: 'audio/mp3'});
            }

            fetchMedia('./Drum-go-dum.mp3').then((file) => {
                fileToMediaResource([file]).then((mediaResources) => {
                    mediaResources.forEach(resource => session.enqueueMedia(resource));
                }).catch((error) => console.log(error.message))
            });
        }

        loadMedia();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function updateState(state) {
        stateRef.current = state;
        setPlayerState(stateRef.current);
    }

    function loadAudioFromElement() {
        const state = {...stateRef.current};
        state.audioDuration = state.audioElement.duration;
        updateState(state);
    }

    function unloadAudio() {
        const state = {...stateRef.current};
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
        playerState.session.handleAudioEnded();
    }

    function handleSessionUpdated() {
        const state = {...stateRef.current};
        updateState(state);
    }

    function handleMediaResourceLoaded(mediaResources) {
        for (const media of mediaResources)
            playerState.session.enqueueMedia(media);
    }

    function handleAudioSelected(media) {
        playerState.session.handleAudioSelected(media);
    }

    function handleAudioRemovedFromPlaylist(media) {
        playerState.session.dequeueMedia(media);
    }

    function handleToggleShuffle() {
        playerState.session.toggleShuffle();
    }

    function handleToggleLoop() {
        playerState.session.toggleLoop();
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
        if (!state.session.canPlay())
            return;
        state.audioElement.play();
        // Logging does it for now.
        state.audioContext.resume().catch(error => console.log(error));
        state.isPlaying = true;
        stateRef.current = state;
        updateState(state);
    }

    function handleNextRequested() {
        const state = {...stateRef.current};
        state.session.loadNext();
        triggerPlay();
        updateState(state);
    }

    function handlePlaylistCleared() {
        playerState.session.reset();
    }

    function handlePrevRequested() {
        const state = {...stateRef.current};
        state.session.loadPrev();
        triggerPlay();
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

    function triggerPlay() {
        handleAudioResumed();
    }

    function resetPlayback() {
        const state = {...stateRef.current};
        state.audioElement.src = '';
        state.audioElement.pause();
        state.audioElement.currentTime = 0;
        state.audioDuration = 0;
        state.isPlaying = false;
        updateState(state);
    }

    function triggerPlaybackReset() {
        resetPlayback();
    }

    function getView() {
        switch (playerState.currentView) {
            case PlayerView.Equalizer:
                return (<EqualizerView onPresetChanged={handlePresetChanged}
                                       onFilterTuned={handleFilterTuned}
                                       onEqToggleRequested={handleEqToggleRequested}
                                       onEqResetRequested={handleEqResetRequested}/>);
            case PlayerView.Playlist:
                return (<PlaylistView
                    onMediaResourceLoaded={handleMediaResourceLoaded}
                    onAudioSelected={handleAudioSelected}
                    onAudioRemoved={handleAudioRemovedFromPlaylist}
                    onPlaylistCleared={handlePlaylistCleared}
                />)
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
                            onNext={handleNextRequested}
                            onPrev={handlePrevRequested}
                            onAudioSeeked={handleAudioSeeked}
                            onToggleShuffle={handleToggleShuffle}
                            onToggleLoop={handleToggleLoop}
                />
            </div>
        </PlayerContext.Provider>
    );
}
