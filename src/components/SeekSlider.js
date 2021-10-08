import React, {useContext} from "react";
import PlayerContext from "./PlayerContext";

export default function SeekSlider() {
    const {bufferSource} = useContext(PlayerContext);
    return (
        <div className={"seek-slider"}>
            <input type="range" min="1" max="100" step="1"/>
            <p>Song duration: {bufferSource.buffer.duration / 60}</p>
        </div>
    );
}