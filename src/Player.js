import React from 'react';
import PlayButton from "./components/PlayButton";
import SeekSlider from "./components/SeekSlider";
import PlayerContext from "./components/PlayerContext";
import './index.css';

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            context: null,
            bufferSource: null,
            shared: {
                duration: 0,
                currentTime: 0,
                playing: false,
            }
        }
        this.intervalId = 0;
    }

    resumePlayback = () => {
        const state = this.state;
        state.context.resume();
        const updateSharedState = (state) => {
            const shared = this.state;
            shared.duration = state.bufferSource.buffer.duration;
            shared.currentTime = state.context.currentTime;
            shared.playing = true;
            return {shared: shared};
        }

        this.intervalId = setInterval(() => {
            this.setState(updateSharedState);
        }, 50);
    }

    intervalIdResetHelper = () => {
        clearInterval(this.intervalId);
        this.intervalId = 0;
    }

    pausePlayback = () => {
        this.state.context.suspend();
        this.intervalIdResetHelper();
        const state = this.state;
        state.shared.playing = false;
        this.setState(state);
    }

    sharedDataResetHelper = (state) => {
        state.shared.duration = 0;
        state.shared.currentTime = 0;
        state.shared.playing = false;
    }

    resetPlayer = () => {
        const state = this.state;
        state.context.close();
        state.context = null;
        clearInterval(this.intervalId);
        this.intervalId = 0;
        this.sharedDataResetHelper(state);
        this.setState(state);
    }

    loadAudio = async () => {
        const response = await fetch("./kda.mp3");
        let arrayBuffer = null;
        if (response.status === 200)
            arrayBuffer = await response.arrayBuffer();

        const context = new AudioContext();
        const bufferSource = context.createBufferSource();
        bufferSource.buffer = await context.decodeAudioData(arrayBuffer);
        bufferSource.connect(context.destination);
        bufferSource.start();
        bufferSource.onended = this.resetPlayer;
        this.setState({
            context: context,
            bufferSource: bufferSource
        });
    }

    componentDidMount = () => {
        this.loadAudio().catch((error) => {
            console.log(error);
        })
    }

    componentWillUnmount = () => {
        this.resetPlayer();
    }

    togglePlayback = () => {
        if (this.state.shared.playing)
            this.pausePlayback();
        else this.resumePlayback();
    }

    render() {
        if (this.state.bufferSource === null)
            return <span>Loading...</span>;

        return (
            <PlayerContext.Provider value={this.state.shared}>
                <SeekSlider/>
                <PlayButton onPlaybackToggleRequested={this.togglePlayback}/>
            </PlayerContext.Provider>
        )
    };
}