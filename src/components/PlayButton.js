import React, {useState} from "react";

export default function PlayButton(props) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleClick = () => {
        props.onPlaybackToggleRequested();
        setIsPlaying(!isPlaying);
    }

    const buttonText = isPlaying ? 'Pause' : 'Play';
    return (<button onClick={handleClick}>{buttonText}</button>);
}