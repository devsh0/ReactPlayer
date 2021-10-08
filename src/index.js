import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const PlayerState = React.createContext(null);

class SeekSlider extends React.Component {
    static contextType = PlayerState;

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        console.log(this.context);
    }

    render() {
        return (
            <div className={"seek-slider"}>
                <input type="range" min="1" max="100" step="1"/>
            </div>
        );
    }
}

class PlayButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false
        }
    }

    handleClick = () => {
        this.props.onPlaybackToggleRequested();
        this.setState({
            playing: !this.state.playing
        });
    }

    render() {
        const buttonText = this.state.playing ? 'Pause' : 'Play';
        return (<button onClick={this.handleClick}>{buttonText}</button>);
    }
}

class Player extends React.Component {
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
            <PlayerState.Provider value={this.state}>
                <Fragment>
                    <SeekSlider/>
                    <PlayButton onPlaybackToggleRequested={this.togglePlayback}/>
                </Fragment>
            </PlayerState.Provider>
        )
    };
}

ReactDOM.render(<Player/>, document.getElementById('root'));
