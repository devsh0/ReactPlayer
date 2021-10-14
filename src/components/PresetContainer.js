import PresetTray from "./PresetTray";

export default function PresetContainer() {
    return (
        <div className={'preset-container'}>
            <button className={'btn edge'}>Play</button>
            <PresetTray />
            <button className={'btn edge'}>Tweak</button>
        </div>);
}