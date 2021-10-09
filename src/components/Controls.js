import {useContext, useState} from "react";
import PlayerContext from "./PlayerContext";

export default function Controls(props) {
    const shared = useContext(PlayerContext);
    const [isPlaying, setIsPlaying] = useState(shared.playing);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        props.togglePlayPause();
    }

    return (
        <div id={'audio-controls-container'}>
            <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button>Next</button>
            <button>Prev</button>
        </div>
    )
}