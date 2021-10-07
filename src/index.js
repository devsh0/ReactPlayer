import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class SeekSlider extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"seek-slider"}>
                <input type="range" min="1" max="100" step="1" />
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
        this.context = null
        this.bufferSource = null
    }

    componentDidMount = () => {
        this.context = new AudioContext();
        this.bufferSource = this.context.createBufferSource();
        fetch("./kda.mp3").then((response) => {
            if (response.status === 200) {
                console.log("Audio data loaded!");
                return response.arrayBuffer();
            }
            throw Error("something went horribly wrong!");
        }).then((buffer) => {
            return this.context.decodeAudioData(buffer);
        }).then((decodedData) => {
            this.bufferSource.buffer = decodedData;
            this.bufferSource.connect(this.context.destination);
            this.bufferSource.start(0);
        }).catch((error) => {
            console.log(error.message);
        });
    }

    componentWillUnmount = () => {
        this.context.close();
    }

    togglePlayback = () => {
        console.log(`Song Length: ${this.bufferSource.buffer.duration}`);
        console.log(`Played Duration: ${this.context.currentTime}`);
        
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        if (this.context.state === 'running') {
            this.context.suspend();
        }
    }

    render() {
        return (
            <Fragment>
                <SeekSlider />
                <PlayButton onPlaybackToggleRequested={this.togglePlayback}/>
            </Fragment>
        )
    };
}

ReactDOM.render(
    <Player/>
    , document.getElementById('root'));
