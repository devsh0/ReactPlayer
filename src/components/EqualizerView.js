import EqualizerBand from "./EqualizerBand";
import PresetContainer from "./PresetContainer";
import ScaleAxis from "./ScaleAxis";
import { useContext } from "react";
import PlayerContext from "./PlayerContext";

export default function EqualizerView({
  onPresetChanged,
  onFilterTuned,
  onEqToggleRequested,
  onEqResetRequested,
}) {
  const playerContext = useContext(PlayerContext);

  const bands = playerContext.filterpackNode
    .getFilters()
    .map((filter, i) => (
      <EqualizerBand
        key={filter.getFrequency()}
        index={i}
        onBandTuned={onFilterTuned}
      />
    ));

  return (
    <div className={"component equalizer"}>
      <div className={"overlay"}></div>
      <PresetContainer
        onPresetChanged={onPresetChanged}
        onEqToggleRequested={onEqToggleRequested}
        onEqResetRequested={onEqResetRequested}
      />

      <div className={"band-array-container"}>
        <ScaleAxis />
        {bands}
      </div>
    </div>
  );
}
