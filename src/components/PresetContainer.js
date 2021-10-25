import PresetTray from "./PresetTray";
import { useContext } from "react";
import PlayerContext from "./PlayerContext";

export default function PresetContainer({
  onPresetChanged,
  onEqToggleRequested,
  onEqResetRequested,
}) {
  const playerContext = useContext(PlayerContext);
  const eqEnabled = playerContext.equalizer.isEnabled;

  const handleEqToggle = () => {
    onEqToggleRequested();
  };

  const handleEqReset = () => {
    if (eqEnabled) onEqResetRequested();
  };

  return (
    <div className={"preset-container"}>
      <button
        className={`btn ${eqEnabled ? "enabled" : "disabled"}`}
        onClick={handleEqReset}
      >
        Reset
      </button>
      <PresetTray onPresetChanged={onPresetChanged} />
      <button className={"btn"} onClick={handleEqToggle}>
        {eqEnabled ? "Disable" : "Enable"}
      </button>
    </div>
  );
}
