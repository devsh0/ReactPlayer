import EqualizerBand from "./EqualizerBand";
import PresetContainer from "./PresetContainer";
import {useState} from "react";
import ScaleAxis from "./ScaleAxis";

export default function Equalizer({filterpack}) {
    const [currentPreset, setCurrentPreset] = useState(filterpack.getCurrentPreset());
    const [eqEnabled, setEqEnabled] = useState(filterpack.isEnabled());

    const handlePresetChange = (key) => {
        if (filterpack.isEnabled()) {
            key = key.toLowerCase();
            filterpack.setCurrentPreset(key);
            setCurrentPreset(filterpack.getCurrentPreset());
        }
    }

    const handleTuning = () => {
        if (filterpack.isEnabled()) {
            filterpack.registerCustomPreset();
            handlePresetChange('custom');
        }
    }

    const handleEqToggle = () => {
        filterpack.setEnabled(!eqEnabled);
        setEqEnabled(!eqEnabled);
    }

    const handleEqReset = () => {
        if (filterpack.isEnabled()) {
            filterpack.reset();
            handlePresetChange('custom');
        }
    }

    const getBands = () => {
        let bands = [];
        filterpack.filterArray.forEach((filter, i) => {
            bands.push(<EqualizerBand key={filter.frequency} filter={filter} filterGain={currentPreset.value[i]}
                                      onBandTuned={handleTuning} eqEnabled={eqEnabled} />);
        });
        return bands;
    }

    return (
        <div className={'component equalizer'}>
            <PresetContainer filterpack={filterpack} onPresetChange={handlePresetChange} onEqToggle={handleEqToggle} onEqReset={handleEqReset}/>
            <div className={'band-array-container'}>
                <ScaleAxis />
                {getBands()}
            </div>
        </div>
    )
}
