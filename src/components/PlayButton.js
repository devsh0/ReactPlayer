import React, {useContext} from "react";
import PlayerContext from "./PlayerContext";

export default function PlayButton(props) {
    const {playing} = useContext(PlayerContext);
    const buttonText = playing ? 'Pause' : 'Play';
    return (<button onClick={props.onPlaybackToggleRequested}>{buttonText}</button>);
}