import React, {useContext} from "react";
import PlayerContext from "./PlayerContext";

export default function SeekSlider() {
    const {duration, currentTime} = useContext(PlayerContext);

    const handleChange = (event) => {
        console.log("Value changed");
    }

    const time = Math.floor(currentTime);
    return (
        <div className={"seek-slider"}>
            <input type="range" min="1" max={duration} step="1" value={time} onChange={handleChange} disabled={true}/>
            <p>Song Played: {time}</p>
        </div>
    );
}