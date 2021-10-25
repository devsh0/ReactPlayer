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
import { Views } from "./Views";

export default function PlaybackController({
  onPlayPause,
  onViewSwitched,
  onNext,
  onPrev,
  onToggleShuffle,
  onToggleLoop,
}) {
  const playerContext = useContext(PlayerContext);
  const isEqView = playerContext.currentView === Views.Equalizer;
  const isPlaylistView = playerContext.currentView === Views.Playlist;
  const shuffling = playerContext.session.shuffle;
  const repeating = playerContext.session.repeat;
  const repeatingOrLooping = repeating || playerContext.session.loop;
  const playing = playerContext.isPlaying;

  return (
    <div className={"playback-controller"}>
      <section className={"start"}>
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
            onViewSwitched(isPlaylistView ? Views.Visualizer : Views.Playlist)
          }
        >
          <PlaylistIcon />
        </button>
      </section>
      <section className={"center"}>
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
      </section>
      <section className={"end"}>
        <button
          title={"Equalizer"}
          className={"ctrl-btn eq " + (isEqView ? "tapped" : "")}
          onClick={(_) =>
            onViewSwitched(isEqView ? Views.Visualizer : Views.Equalizer)
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
      </section>
    </div>
  );
}
