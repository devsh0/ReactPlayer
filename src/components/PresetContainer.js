import PresetTray from "./PresetTray";

export default function PresetContainer({filterpack, onPresetChange, loadedPresetKey, onEqToggle, onEqReset, eqEnabled}) {

    const handleEqToggle = () => {
        onEqToggle();
    }

    const handleEqReset = () => {
        if (eqEnabled)
            onEqReset();
    }

    return (
        <div className={'preset-container'}>
            <button className={`btn ${eqEnabled ? 'enabled' : 'disabled'}`} onClick={handleEqReset}>Reset</button>
            <PresetTray
                loadedPresetKey={loadedPresetKey}
                onPresetChange={onPresetChange}
                eqEnabled={eqEnabled}
                filterpack={filterpack}/>
            <button className={'btn'} onClick={handleEqToggle}>{eqEnabled ? 'Disable' : 'Enable'}</button>
        </div>);
}