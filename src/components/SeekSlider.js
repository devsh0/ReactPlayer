import {useContext, useState} from "react";
import PlayerContext from "./PlayerContext";

export default function SeekSlider () {
    const {sharedState, handleSetPosition} = useContext(PlayerContext);
    console.log(`Duration: ${sharedState.duration}`);
    return (
        <input type='range' max={sharedState.duration} step='1'
               value={sharedState.position}
               onChange={(e) => handleSetPosition(e.target.value)}/>
    );
}