import React, {useContext} from "react";
import PlayerContext from "./PlayerContext";

export default function SeekSlider() {
    const {duration, currentTime} = useContext(PlayerContext);

    const handleChange = (event) => {
        console.log("Value changed");
    }

    return (
        <div className={"seek-slider"}>
            <input type="range" min="1" max={duration} step="1" value={currentTime} onChange={handleChange}/>
            <p>Song Played: {currentTime}</p>
        </div>
    );
}