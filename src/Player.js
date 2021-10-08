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
            bufferSource: null
        }
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
        bufferSource.start(0);
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
        this.state.context.close();
    }

    togglePlayback = () => {
        this.setState((state) => {
            const context = state.context;
            if (context.state === 'suspended') {
                context.resume();
                return;
            }

            context.suspend();
            return {context: context};
        })
    }

    render() {
        if (this.state.bufferSource === null)
            return <span>Loading...</span>;

        return (
            <PlayerContext.Provider value={this.state}>
                <SeekSlider/>
                <PlayButton onPlaybackToggleRequested={this.togglePlayback}/>
            </PlayerContext.Provider>
        )
    };
}