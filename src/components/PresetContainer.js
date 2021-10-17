import PresetTray from "./PresetTray";

export default function PresetContainer({filterpack, onPresetChange, onEqToggle, onEqReset}) {

    const handleEqToggle = () => {
        onEqToggle();
    }

    const handleEqReset = () => {
        if (filterpack.isEnabled())
            onEqReset();
    }

    return (
        <div className={'preset-container'}>
            <button className={`btn ${filterpack.isEnabled() ? 'enabled' : 'disabled'}`} onClick={handleEqReset}>Reset</button>
            <PresetTray onPresetChange={onPresetChange} filterpack={filterpack}/>
            <button className={'btn'} onClick={handleEqToggle}>{filterpack.isEnabled() ? 'Disable' : 'Enable'}</button>
        </div>);
}