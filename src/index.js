import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';

class PlayButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false
        }
    }

    handleClick = () => {
        this.props.playbackToggleRequested();
        this.setState({
            playing: !this.state.playing
        });
    }

    render() {
        const buttonText = this.state.playing ? 'Pause' : 'Play';
        return (<button onClick={this.handleClick}>{buttonText}</button>);
    }
}

class Audio extends React.Component {
    constructor(props) {
        super(props);
        this.context = null
        this.audioElement = null
    }

    componentDidMount = () => {
        this.context = new AudioContext();
        this.audioElement = document.querySelector("#audio-element");
        const track = this.context.createMediaElementSource(this.audioElement);
        track.connect(this.context.destination);
    }

    componentWillUnmount = () => {
        this.context.close();
    }

    togglePlayback = () => {
        if (this.context.state === 'suspended') {
            this.audioElement.play();
            this.context.resume();
        }
        if (this.context.state === 'running') {
            this.context.suspend();
        }
    }

    render() {
        return (
            <Fragment>
                <PlayButton playbackToggleRequested={this.togglePlayback}/>
                <audio src={"kda.mp3"} id={"audio-element"}></audio>
            </Fragment>
        )
    };
}


ReactDOM.render(
    <Audio/>
    , document.getElementById('root'));
