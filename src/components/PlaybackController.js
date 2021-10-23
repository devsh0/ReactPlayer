import {BiShuffle, ImEqualizer2, MdSkipNext, MdSkipPrevious, RiPlayList2Fill, RiRepeatFill} from "react-icons/all";
import {BsPauseFill, BsPlayFill} from "react-icons/bs";
import React, {useContext} from "react";
import PlayerContext from "./PlayerContext";
import {PlayerView} from "./PlayerView";

export default function PlaybackController({onPlayPause, onViewSwitched, onToggleShuffle, onToggleLoop}) {
    const playerContext = useContext(PlayerContext);
    const isEqView = playerContext.currentView === PlayerView.Equalizer;
    const isPlaylistView = playerContext.currentView === PlayerView.Playlist;

    return (
        <div className={'playback-controller'}>
            <div className={'section start'}>
                <button className={'ctrl-btn shuffle'} onClick={onToggleShuffle}><BiShuffle/></button>
                <button className={'ctrl-btn playlist ' + (isPlaylistView ? 'tapped' : '')}
                        onClick={_ => onViewSwitched(isPlaylistView ? PlayerView.Visualizer : PlayerView.Playlist)}><RiPlayList2Fill/></button>
            </div>
            <div className={'section center'}>
                <button className={'ctrl-btn'}><MdSkipPrevious/></button>
                <button className={'ctrl-btn'} onClick={onPlayPause}>
                    {playerContext.isPlaying ? <BsPauseFill/> : <BsPlayFill/>}
                </button>
                <button className={'ctrl-btn'}><MdSkipNext/></button>
            </div>
            <div className={'section end'}>
                <button className={'ctrl-btn eq ' + (isEqView ? 'tapped' : '')}
                        onClick={_ => onViewSwitched(isEqView ? PlayerView.Visualizer : PlayerView.Equalizer)}><ImEqualizer2/></button>
                <button onClick={onToggleLoop} className={'ctrl-btn repeat loop'}><RiRepeatFill/></button>
            </div>
        </div>
    );
}