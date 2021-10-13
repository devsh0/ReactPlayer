import {useRef, useState} from "react";
import PresetTray from "./PresetTray";

export default function PresetContainer() {
    const [isDropped, setDropped] = useState(false);

    const handleDropdownToggle = () => setDropped(!isDropped);

    return (
        <div className={'preset-container'}>
            <button className={'btn edge'}>Play</button>
            <button className={'btn drop-down'} onClick={handleDropdownToggle}>Presets</button>
            <button className={'btn edge'}>Tweak</button>
            <PresetTray show={isDropped} />
        </div>);
}