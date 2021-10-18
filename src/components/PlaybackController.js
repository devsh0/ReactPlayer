import {BiShuffle, ImEqualizer2, MdSkipNext, MdSkipPrevious, RiPlayList2Fill, RiRepeatFill} from "react-icons/all";
import {BsPauseFill, BsPlayFill} from "react-icons/bs";
import React, {useContext} from "react";
import PlayerContext from "./PlayerContext";
import {PlayerView} from "./PlayerView";

export default function PlaybackController({onPlayPause, onViewSwitched}) {
    const playerContext = useContext(PlayerContext);
    const isEqView = playerContext.currentView === PlayerView.Equalizer;

    return (
        <div className={'playback-controller'}>
            <div className={'section start'}>
                <button className={'ctrl-btn shuffle'}><BiShuffle/></button>
                <button className={'ctrl-btn playlist'}><RiPlayList2Fill/></button>
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
                        onClick={_ => onViewSwitched(PlayerView.Equalizer)}><ImEqualizer2/></button>
                <button className={'ctrl-btn loop'}><RiRepeatFill/></button>
            </div>
        </div>
    );
}