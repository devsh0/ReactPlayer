import PresetTray from "./PresetTray";

export default function PresetContainer({filterpack, onPresetChange, loadedPresetKey, onEqToggle, enabled}) {

    const toggleEqEnabled = (event) => {
        onEqToggle();
    }

    return (
        <div className={'preset-container'}>
            <button className={'btn'}>Play</button>
            <PresetTray
                loadedPresetKey={loadedPresetKey}
                onPresetChange={onPresetChange}
                enabled={enabled}
                filterpack={filterpack}/>
            <button className={'btn'} onClick={toggleEqEnabled}>{enabled ? 'Disable' : 'Enable'}</button>
        </div>);
}