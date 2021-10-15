import {BiShuffle, IoRepeat, MdLoop, MdSkipNext, MdSkipPrevious, RiRepeatFill} from "react-icons/all";
import {BsPauseFill, BsPlayFill} from "react-icons/bs";
import React from "react";

export default function PlaybackController({controllerState, onPlayPause}) {
    return (
        <div className={'playback-controller'}>
            <div className={'section start'}>
                <button className={'ctrl-btn shuffle'}><BiShuffle /></button>
            </div>
            <div className={'section center'}>
                <button className={'ctrl-btn'}><MdSkipPrevious /></button>
                <button className={'ctrl-btn'} onClick={onPlayPause}>
                    {controllerState.playing ? <BsPauseFill/> : <BsPlayFill/>}
                </button>
                <button className={'ctrl-btn'}><MdSkipNext/></button>
            </div>
            <div className={'section end'}>
                <button className={'ctrl-btn loop'}><RiRepeatFill /></button>
            </div>
        </div>
    );
}