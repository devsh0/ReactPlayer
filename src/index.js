import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';

class Audio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            context: null,
            audioElement: null,
        }
    }

    componentDidMount = () => {
        this.setState((state) => {
            state.context = new AudioContext();
            state.audioElement = document.querySelector("#audio-element");
            const track = this.state.context.createMediaElementSource(state.audioElement);
            track.connect(state.context.destination);
        })
    }

    componentWillUnmount = () => {
        this.state.context.close();
    }

    togglePlayback = () => {
        const context = this.state.context;
        console.log(context);
        if (context.state === 'suspended') {
            this.state.audioElement.play();
            context.resume();
        }
        if (context.state === 'running') {
            context.suspend();
        }
        this.setState({
            playing: !this.state.playing
        });
    }

    render() {
        const buttonSays = this.state.playing ? 'Pause' : 'Play';
        return (
            <Fragment>
                <audio src={"kda.mp3"} id={"audio-element"}></audio>
                <button onClick={this.togglePlayback}>{buttonSays}</button>
            </Fragment>
        )
    };
}


ReactDOM.render(
    <Audio/>
    , document.getElementById('root'));
