import {useContext, useState} from "react";
import PlayerContext from "./PlayerContext";
import SeekSlider from "./SeekSlider";

export default function Controls(props) {
    const {sharedState} = useContext(PlayerContext);
    const [isPlaying, setIsPlaying] = useState(sharedState.playing);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        props.togglePlayPause();
    }

    return (
        <div id={'audio-controls-container'}>
            <SeekSlider />
            <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button>Next</button>
            <button>Prev</button>
        </div>
    )
}