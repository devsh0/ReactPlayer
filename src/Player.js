import React, {Fragment} from 'react';
import PlayButton from "./components/PlayButton";
import SeekSlider from "./components/SeekSlider";
import PlayerContext from "./components/PlayerContext";
import './index.css';

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            context: new AudioContext(),
            bufferSource: null
        }
    }

    loadAudio = async () => {
        const response = await fetch("./kda.mp3");
        let arrayBuffer = null;
        if (response.status === 200)
            arrayBuffer = await response.arrayBuffer();

        // Not sure if it's okay to access `context` from state and do things with it outside `setState`.
        // But I can't seem to find any visible side-effects, so here it'll stay.
        const state = this.state;
        const bufferSource = state.context.createBufferSource();
        bufferSource.buffer = await state.context.decodeAudioData(arrayBuffer);
        bufferSource.connect(state.context.destination);
        bufferSource.start(0);
        this.setState({bufferSource: bufferSource});
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
                <Fragment>
                    <SeekSlider/>
                    <PlayButton onPlaybackToggleRequested={this.togglePlayback}/>
                </Fragment>
            </PlayerContext.Provider>
        )
    };
}