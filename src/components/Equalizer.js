import EqualizerBand from "./EqualizerBand";
import PresetContainer from "./PresetContainer";
import {useState} from "react";

export default function Equalizer({filterpack}) {
    const [loadedPresetKey, setLoadedPresetKey] = useState('custom')
    const [loadedPreset, setLoadedPreset] = useState(filterpack.getPreset('custom'));

    const handlePresetChange = (key) => {
        key = key.toLowerCase();
        setLoadedPresetKey(key);
        setLoadedPreset(filterpack.getPreset(key));
        console.log(`${key}: ${loadedPreset}`);
    }

    const handleTuning = () => {
        filterpack.registerCustomPreset();
        handlePresetChange('custom');
    }

    return (
        <div className={'equalizer'}>
            <PresetContainer loadedPresetKey={loadedPresetKey} onPresetChange={handlePresetChange} filterpack={filterpack}/>
            <div className={'band-array-container'}>
                <EqualizerBand filter={filterpack.filterArray[0]} filterGain={loadedPreset[0]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[1]} filterGain={loadedPreset[1]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[2]} filterGain={loadedPreset[2]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[3]} filterGain={loadedPreset[3]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[4]} filterGain={loadedPreset[4]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[5]} filterGain={loadedPreset[5]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[6]} filterGain={loadedPreset[6]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[7]} filterGain={loadedPreset[7]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[8]} filterGain={loadedPreset[8]} onBandTuned={handleTuning}/>
                <EqualizerBand filter={filterpack.filterArray[9]} filterGain={loadedPreset[9]} onBandTuned={handleTuning}/>
            </div>
        </div>
    )
}
