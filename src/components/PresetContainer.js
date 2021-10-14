import PresetTray from "./PresetTray";

export default function PresetContainer({filterpack, onPresetChange, loadedPresetKey}) {
    return (
        <div className={'preset-container'}>
            <button className={'btn'}>Play</button>
            <PresetTray loadedPresetKey={loadedPresetKey} onPresetChange={onPresetChange} filterpack={filterpack}/>
            <button className={'btn'}>Tweak</button>
        </div>);
}