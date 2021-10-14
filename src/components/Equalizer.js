import EqualizerBand from "./EqualizerBand";
import PresetContainer from "./PresetContainer";
import {useState} from "react";

export default function Equalizer({filterpack}) {
    const [loadedPreset, setLoadedPreset] = useState(filterpack.getPreset('custom'));

    const handlePresetChange = (key) => {
        setLoadedPreset(filterpack.getPreset(key));
    }

    return (
        <div className={'equalizer'}>
            <PresetContainer onPresetChange={handlePresetChange} filterpack={filterpack}/>
            <div className={'band-array-container'}>
                <EqualizerBand filter={filterpack.filterArray[0]} filterGain={loadedPreset[0]}/>
                <EqualizerBand filter={filterpack.filterArray[1]} filterGain={loadedPreset[1]}/>
                <EqualizerBand filter={filterpack.filterArray[2]} filterGain={loadedPreset[2]}/>
                <EqualizerBand filter={filterpack.filterArray[3]} filterGain={loadedPreset[3]}/>
                <EqualizerBand filter={filterpack.filterArray[4]} filterGain={loadedPreset[4]}/>
                <EqualizerBand filter={filterpack.filterArray[5]} filterGain={loadedPreset[5]}/>
                <EqualizerBand filter={filterpack.filterArray[6]} filterGain={loadedPreset[6]}/>
                <EqualizerBand filter={filterpack.filterArray[7]} filterGain={loadedPreset[7]}/>
                <EqualizerBand filter={filterpack.filterArray[8]} filterGain={loadedPreset[8]}/>
                <EqualizerBand filter={filterpack.filterArray[9]} filterGain={loadedPreset[9]}/>
            </div>
        </div>
    )
}
