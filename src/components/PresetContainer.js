import PresetTray from "./PresetTray";

export default function PresetContainer({filterpack, onPresetChange, loadedPresetKey, onEqToggle, onEqReset, enabled}) {

    const handleEqToggle = () => {
        onEqToggle();
    }

    const handleEqReset = () => {
        if (enabled)
            onEqReset();
    }

    return (
        <div className={'preset-container'}>
            <button className={`btn ${enabled ? 'enabled' : 'disabled'}`} onClick={handleEqReset}>Reset</button>
            <PresetTray
                loadedPresetKey={loadedPresetKey}
                onPresetChange={onPresetChange}
                enabled={enabled}
                filterpack={filterpack}/>
            <button className={'btn'} onClick={handleEqToggle}>{enabled ? 'Disable' : 'Enable'}</button>
        </div>);
}