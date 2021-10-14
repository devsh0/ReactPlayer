import {useRef, useState} from "react";

export default function PresetTray() {
    const [isDropped, setDropped] = useState(false);
    const selected = useRef();

    const handleDropdownToggle = () => setDropped(!isDropped);

    const handlePresetChange= (event) => {
        selected.current.classList.remove('selected');
        const target = event.target;
        target.classList.add('selected');
        selected.current = target;
        setDropped(false);
    }

    return (
        <div className={'drop-down-container'}>
            <button className={'btn drop-down'}
                    onClick={handleDropdownToggle}>
                {selected.current ? selected.current.innerText : 'Custom'}
            </button>
            <div className={`preset-tray ${isDropped || 'hidden'}`}>
                <div ref={selected} className={'item selected'} onClick={handlePresetChange}>Custom</div>
                <div className={'item'} onClick={handlePresetChange}>Bass</div>
                <div className={'item'} onClick={handlePresetChange}>Treble</div>
                <div className={'item'} onClick={handlePresetChange}>Pop</div>
                <div className={'item'} onClick={handlePresetChange}>Rock</div>
                <div className={'item'} onClick={handlePresetChange}>Jazz</div>
                <div className={'item'} onClick={handlePresetChange}>Folk</div>
                <div className={'item'} onClick={handlePresetChange}>Party</div>
            </div>
        </div>
    )
}