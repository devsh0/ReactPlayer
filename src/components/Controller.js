import React, { useContext } from "react";
import SeekSlider from "./SeekSlider";
import PlaybackController from "./PlaybackController";
import PlayerContext from "./PlayerContext";

// This component ain't doing much. Can be removed.
export default function Controller(props) {
  const playerContext = useContext(PlayerContext);

  const handlePlayPause = () => {
    if (playerContext.isPlaying) props.onAudioPaused();
    else props.onAudioResumed();
  };

  return (
    <div className={"audio-controls-container"}>
      <SeekSlider onSeek={props.onAudioSeeked} />
      <PlaybackController
        onPlayPause={handlePlayPause}
        onViewSwitched={props.onViewSwitched}
        onNext={props.onNext}
        onPrev={props.onPrev}
        onToggleShuffle={props.onToggleShuffle}
        onToggleLoop={props.onToggleLoop}
      />
    </div>
  );
}
