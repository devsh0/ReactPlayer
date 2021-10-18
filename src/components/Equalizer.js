import EqualizerBand from "./EqualizerBand";
import PresetContainer from "./PresetContainer";
import ScaleAxis from "./ScaleAxis";
import {useContext} from "react";
import PlayerContext from "./PlayerContext";

export default function Equalizer({onPresetChanged, onFilterTuned, onEqToggleRequested, onEqResetRequested}) {
    const playerContext = useContext(PlayerContext);

    const getBands = () => {
        let bands = [];
        playerContext.filterpackNode.getFilters().forEach((filter, i) => {
            bands.push(<EqualizerBand key={filter.getFrequency()} index={i} onBandTuned={onFilterTuned}/>);
        });
        return bands;
    }

    return (
        <div className={'component equalizer'}>
            <PresetContainer onPresetChanged={onPresetChanged}
                             onEqToggleRequested={onEqToggleRequested}
                             onEqResetRequested={onEqResetRequested}/>

            <div className={'band-array-container'}>
                <ScaleAxis/>
                {getBands()}
            </div>
        </div>
    )
}
