import React from "react";

export default class PlayButton extends React.Component {
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