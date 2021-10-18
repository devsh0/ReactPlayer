import {BiShuffle, ImEqualizer2, MdSkipNext, MdSkipPrevious, RiPlayList2Fill, RiRepeatFill} from "react-icons/all";
import {BsPauseFill, BsPlayFill} from "react-icons/bs";
import React, {useEffect, useState} from "react";

export default function PlaybackController({controllerState, onPlayPause, onViewSwitch}) {
    const [isEqView, setIsEqView] = useState(controllerState.isEqView);
    console.log(`EqView: ${isEqView}`);

    useEffect(() => {
        setIsEqView(controllerState.isEqView);
    }, [controllerState.isEqView])

    return (
        <div className={'playback-controller'}>
            <div className={'section start'}>
                <button className={'ctrl-btn shuffle'}><BiShuffle /></button>
                <button className={'ctrl-btn playlist'}><RiPlayList2Fill /> </button>
            </div>
            <div className={'section center'}>
                <button className={'ctrl-btn'}><MdSkipPrevious /></button>
                <button className={'ctrl-btn'} onClick={onPlayPause}>
                    {controllerState.playing ? <BsPauseFill/> : <BsPlayFill/>}
                </button>
                <button className={'ctrl-btn'}><MdSkipNext/></button>
            </div>
            <div className={'section end'}>
                <button className={'ctrl-btn eq ' + (isEqView ? 'tapped' : '')} onClick={onViewSwitch}><ImEqualizer2 /></button>
                <button className={'ctrl-btn loop'}><RiRepeatFill /></button>
            </div>
        </div>
    );
}