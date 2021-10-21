import React, {useContext} from "react";
import SeekSlider from "./SeekSlider";
import PlaybackController from "./PlaybackController";
import PlayerContext from "./PlayerContext";


export default function Controller(props) {
    const playerContext = useContext(PlayerContext);

    const handlePlayPause = () => {
        if (playerContext.isPlaying)
            props.onAudioPaused();
        else
            props.onAudioResumed();
    }

    return (
        <div className={'audio-controls-container'}>
            <SeekSlider onSeek={props.onAudioSeeked}/>
            <PlaybackController onPlayPause={handlePlayPause} onViewSwitched={props.onViewSwitched}/>
        </div>
    )
}