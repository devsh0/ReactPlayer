import {BiShuffle, ImEqualizer2, MdSkipNext, MdSkipPrevious, RiPlayList2Fill, RiRepeatFill} from "react-icons/all";
import {BsPauseFill, BsPlayFill} from "react-icons/bs";
import React, {useContext} from "react";
import PlayerContext from "./PlayerContext";
import {ViewEnum} from "./ViewEnum";

export default function PlaybackController({onPlayPause, onViewSwitched, onNext, onPrev, onToggleShuffle, onToggleLoop}) {
    const playerContext = useContext(PlayerContext);
    const isEqView = playerContext.currentView === ViewEnum.Equalizer;
    const isPlaylistView = playerContext.currentView === ViewEnum.Playlist;
    const shuffling = playerContext.session.shuffle;
    const repeating = playerContext.session.repeat;
    const repeatingOrLooping = repeating || playerContext.session.loop;

    return (
        <div className={'playback-controller'}>
            <div className={'section start'}>
                <button className={'ctrl-btn shuffle ' + (shuffling ? 'tapped' : '')} onClick={onToggleShuffle}><BiShuffle/></button>
                <button className={'ctrl-btn playlist ' + (isPlaylistView ? 'tapped' : '')}
                        onClick={_ => onViewSwitched(isPlaylistView ? ViewEnum.Visualizer : ViewEnum.Playlist)}><RiPlayList2Fill/></button>
            </div>
            <div className={'section center'}>
                <button className={'ctrl-btn'} onClick={onPrev}><MdSkipPrevious/></button>
                <button className={'ctrl-btn'} onClick={onPlayPause}>
                    {playerContext.isPlaying ? <BsPauseFill/> : <BsPlayFill/>}
                </button>
                <button className={'ctrl-btn'} onClick={onNext}><MdSkipNext/></button>
            </div>
            <div className={'section end'}>
                <button className={'ctrl-btn eq ' + (isEqView ? 'tapped' : '')}
                        onClick={_ => onViewSwitched(isEqView ? ViewEnum.Visualizer : ViewEnum.Equalizer)}><ImEqualizer2/></button>
                <button onClick={onToggleLoop} className={'ctrl-btn ' + (repeatingOrLooping ? 'tapped' : '')}><RiRepeatFill/>
                    <span className={'repeat-indicator ' + (repeating ? 'show' : '')}>1</span>
                </button>
            </div>
        </div>
    );
}