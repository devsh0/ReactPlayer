import {useEffect, useRef, useState} from "react";

export default function PresetTray({filterpack, onPresetChange, loadedPresetKey, eqEnabled}) {
    const [isDropped, setDropped] = useState(false);
    const selected = useRef();

    const handleDropdownToggle = () => {
        if (!eqEnabled)
            return;
        setDropped(!isDropped);
    }

    const executeSelect = (presetKey, target) => {
        if (!target) {
            const parent = selected.current.parentNode;
            for (let child of parent.children)
                if (child.innerText.toLowerCase() === presetKey) {
                    target = child
                    break;
                }
        }
        if (!target) throw new Error('Preset key did not match any item!');
        selected.current.classList.remove('selected');
        target.classList.add('selected');
        selected.current = target;
        setDropped(false);
        onPresetChange(presetKey);
    }

    const handlePresetChange = (event) => {
        const target = event.target;
        executeSelect(target.innerText, event.target);
    }

    useEffect(() => {
        executeSelect(loadedPresetKey);
    }, [loadedPresetKey])

    useEffect(() => {
        setDropped(isDropped && eqEnabled);
    }, [eqEnabled])

    const getPresetItems = () => {
        const items = [];
        for (let key of Object.keys(filterpack.getPresets())) {
            let item;
            const title = key[0].toUpperCase() + key.slice(1);
            if (key === loadedPresetKey)
                item = <div ref={selected} key={key} className={`item selected`} onClick={handlePresetChange}>{title}</div>
            else
                item = <div key={key} className={`item`} onClick={handlePresetChange}>{title}</div>
            items.push(item);
        }
        return items;
    }

    return (
        <div className={'drop-down-container'}>
            <button className={`btn drop-down ${eqEnabled ? 'enabled' : 'disabled'}`} onClick={handleDropdownToggle}>
                {selected.current ? selected.current.innerText : 'Custom'}
            </button>
            <div className={`preset-tray ${isDropped || 'hidden'}`}>
                {getPresetItems()}
            </div>
        </div>
    )
}