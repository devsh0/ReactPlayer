import {Fragment, useContext} from "react";
import PlayerContext from "./PlayerContext";

export default function SeekSlider () {
    const {sharedState, handleSetPosition} = useContext(PlayerContext);
    return (
        <Fragment>
        <input type='range' max={sharedState.duration} step='1'
               value={sharedState.position}
               onChange={(e) => handleSetPosition(e.target.value)}/>
            <p>{sharedState.position}</p>
        </Fragment>
    );
}