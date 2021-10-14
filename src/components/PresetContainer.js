import PresetTray from "./PresetTray";

export default function PresetContainer({filterpack, onPresetChange}) {
    return (
        <div className={'preset-container'}>
            <button className={'btn'}>Play</button>
            <PresetTray onPresetChange={onPresetChange} filterpack={filterpack}/>
            <button className={'btn'}>Tweak</button>
        </div>);
}