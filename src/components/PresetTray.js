import {useRef, useState} from "react";

export default function PresetTray({filterpack, onPresetChange}) {
    const [isDropped, setDropped] = useState(false);
    const selected = useRef();

    const handleDropdownToggle = () => setDropped(!isDropped);

    const handlePresetChange = (event) => {
        selected.current.classList.remove('selected');
        const target = event.target;
        target.classList.add('selected');
        selected.current = target;
        setDropped(false);
        onPresetChange(target.innerText.toLowerCase());
    }

    const presetItems = Object.keys(filterpack.getPresets())
        .map(key => key[0].toUpperCase() + key.slice(1))
        .map((key, i) => {
            return i === 0
                ? <div ref={selected} key={key} className={`item selected`} onClick={handlePresetChange}>{key}</div>
                : <div key={key} className={`item`} onClick={handlePresetChange}>{key}</div>
        });

    return (
        <div className={'drop-down-container'}>
            <button className={'btn drop-down'} onClick={handleDropdownToggle}>
                {selected.current ? selected.current.innerText : 'Custom'}
            </button>
            <div className={`preset-tray ${isDropped || 'hidden'}`}>
                {presetItems}
            </div>
        </div>
    )
}