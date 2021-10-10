import {useContext} from "react";
import PlayerContext from "./PlayerContext";
import SeekSlider from "./SeekSlider";

export default function Controls() {
    const {sharedState, handlePlayPause} = useContext(PlayerContext);

    return (
        <div id={'audio-controls-container'}>
            <SeekSlider />
            <button onClick={handlePlayPause}>{sharedState.playing ? 'Pause' : 'Play'}</button>
            <button>Next</button>
            <button>Prev</button>
        </div>
    )
}