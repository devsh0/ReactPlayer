import { useContext, useEffect, useRef, useState } from "react";
import PlayerContext from "./PlayerContext";

export default function PresetTray({ onPresetChanged }) {
  const playerContext = useContext(PlayerContext);
  const equalizer = playerContext.equalizer;
  const eqEnabled = equalizer.isEnabled;
  const [isDropped, setDropped] = useState(false);
  const selected = useRef();

  const handleDropdownToggle = () => {
    if (!eqEnabled) return;
    setDropped(!isDropped);
  };

  const executeSelect = (presetKey, target) => {
    if (!target) {
      const parent = selected.current.parentNode;
      for (let child of parent.children) {
        if (child.innerText.toLowerCase() === presetKey) {
          target = child;
          break;
        }
      }
    }
    if (!target) throw new Error("Preset key did not match any item!");
    selected.current.classList.remove("selected");
    target.classList.add("selected");
    selected.current = target;
    setDropped(false);
    onPresetChanged(presetKey);
  };

  const handlePresetChange = (event) => {
    const target = event.target;
    executeSelect(target.innerText, event.target);
  };

  useEffect(() => {
    executeSelect(equalizer.currentPreset.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerContext.equalizer.currentPreset.key]);

  useEffect(() => {
    setDropped(isDropped && equalizer.isEnabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eqEnabled]);

  const getPresetItems = () => {
    const items = [];
    for (let preset of playerContext.filterpackNode.getPresets()) {
      const key = preset.key;
      let item;
      const title = key[0].toUpperCase() + key.slice(1);
      if (key === equalizer.currentPreset.key)
        item = (
          <div
            ref={selected}
            key={key}
            className={`item selected`}
            onClick={handlePresetChange}
          >
            {title}
          </div>
        );
      else
        item = (
          <div key={key} className={`item`} onClick={handlePresetChange}>
            {title}
          </div>
        );
      items.push(item);
    }
    return items;
  };

  return (
    <div className={"drop-down-container"}>
      <button
        className={`btn drop-down ${eqEnabled ? "enabled" : "disabled"}`}
        onClick={handleDropdownToggle}
      >
        {selected.current ? selected.current.innerText : "Custom"}
      </button>
      <div className={`preset-tray ${isDropped || "hidden"}`}>
        {getPresetItems()}
      </div>
    </div>
  );
}
