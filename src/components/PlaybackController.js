import {
  BiShuffle as ShuffleIcon,
  ImEqualizer2 as EqualizerIcon,
  MdSkipNext as NextIcon,
  MdSkipPrevious as PrevIcon,
  RiPlayList2Fill as PlaylistIcon,
  RiRepeatFill as LoopIcon,
} from "react-icons/all";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import React, { useContext } from "react";
import PlayerContext from "./PlayerContext";
import { ViewEnum } from "./ViewEnum";

export default function PlaybackController({
  onPlayPause,
  onViewSwitched,
  onNext,
  onPrev,
  onToggleShuffle,
  onToggleLoop,
}) {
  const playerContext = useContext(PlayerContext);
  const isEqView = playerContext.currentView === ViewEnum.Equalizer;
  const isPlaylistView = playerContext.currentView === ViewEnum.Playlist;
  const shuffling = playerContext.session.shuffle;
  const repeating = playerContext.session.repeat;
  const repeatingOrLooping = repeating || playerContext.session.loop;
  const playing = playerContext.isPlaying;

  return (
    <div className={"playback-controller"}>
      <div className={"section start"}>
        <button
          title={"Shuffle"}
          className={"ctrl-btn shuffle " + (shuffling ? "tapped" : "")}
          onClick={onToggleShuffle}
        >
          <ShuffleIcon />
        </button>
        <button
          title={"Playlist"}
          className={"ctrl-btn playlist " + (isPlaylistView ? "tapped" : "")}
          onClick={(_) =>
            onViewSwitched(
              isPlaylistView ? ViewEnum.Visualizer : ViewEnum.Playlist
            )
          }
        >
          <PlaylistIcon />
        </button>
      </div>
      <div className={"section center"}>
        <button title={"Prev"} className={"ctrl-btn"} onClick={onPrev}>
          <PrevIcon />
        </button>
        <button
          title={playing ? "Pause" : "Play"}
          className={"ctrl-btn"}
          onClick={onPlayPause}
        >
          {playing ? <BsPauseFill /> : <BsPlayFill />}
        </button>
        <button title={"Next"} className={"ctrl-btn"} onClick={onNext}>
          <NextIcon />
        </button>
      </div>
      <div className={"section end"}>
        <button
          title={"Equalizer"}
          className={"ctrl-btn eq " + (isEqView ? "tapped" : "")}
          onClick={(_) =>
            onViewSwitched(isEqView ? ViewEnum.Visualizer : ViewEnum.Equalizer)
          }
        >
          <EqualizerIcon />
        </button>
        <button
          title={"Repeat/Loop"}
          onClick={onToggleLoop}
          className={"ctrl-btn " + (repeatingOrLooping ? "tapped" : "")}
        >
          <LoopIcon />
          <span className={"repeat-indicator " + (repeating ? "show" : "")}>
            1
          </span>
        </button>
      </div>
    </div>
  );
}
