import EqualizerBand from "./EqualizerBand";
import PresetContainer from "./PresetContainer";
import {useState} from "react";

export default function Equalizer({filterpack}) {
    const [loadedPresetKey, setLoadedPresetKey] = useState('custom')
    const [loadedPreset, setLoadedPreset] = useState(filterpack.getPreset('custom'));
    const [eqEnabled, setEqEnabled] = useState(filterpack.enabled);

    const handlePresetChange = (key) => {
        key = key.toLowerCase();
        setLoadedPresetKey(key);
        setLoadedPreset(filterpack.getPreset(key));
    }

    const handleTuning = () => {
        filterpack.registerCustomPreset();
        handlePresetChange('custom');
    }

    const handleEqToggle = () => {
        filterpack.setEnabled(!eqEnabled);
        setEqEnabled(!eqEnabled);
    }

    const getBands = () => {
        let bands = [];
        filterpack.filterArray.forEach((filter, i) => {
            bands.push(<EqualizerBand key={filter.frequency}
                                      filter={filter}
                                      filterGain={loadedPreset[i]}
                                      onBandTuned={handleTuning}
                                      enabled={eqEnabled}
            />);
        });
        return bands;
    }

    return (
        <div className={'equalizer'}>
            <PresetContainer loadedPresetKey={loadedPresetKey}
                             onPresetChange={handlePresetChange}
                             enabled={eqEnabled}
                             onEqToggle={handleEqToggle}
                             filterpack={filterpack}/>
            <div className={'band-array-container'}>
                {getBands()}
            </div>
        </div>
    )
}
