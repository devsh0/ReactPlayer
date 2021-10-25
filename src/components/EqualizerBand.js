import { useContext, useEffect, useRef, useState } from "react";
import PlayerContext from "./PlayerContext";

const MAX_GAIN = 12; // dB
let g_previousDragY = 0;

export default function EqualizerBand({ index, onBandTuned }) {
  const playerContext = useContext(PlayerContext);
  const gain = playerContext.equalizer.currentPreset.gains[index];

  const boxRef = useRef();
  const fillRef = useRef();
  const knobRef = useRef();

  const [dragging, setDragging] = useState(false);

  const gainToFillHeight = (gain) => {
    const boxHeight = boxRef.current.clientHeight;
    const knobHeightBias = knobRef.current.clientHeight / 2;
    const step = (boxHeight - knobHeightBias) / (MAX_GAIN * 2);
    return (gain + MAX_GAIN) * step;
  };

  const fillHeightToGain = (fillHeight) => {
    const boxHeight = boxRef.current.clientHeight;
    const knobHeightBias = knobRef.current.clientHeight / 2;
    const step = (boxHeight - knobHeightBias) / (MAX_GAIN * 2);
    return fillHeight / step - MAX_GAIN;
  };

  useEffect(() => {
    const boxHeight = boxRef.current.clientHeight;
    const knobHeightBias = knobRef.current.clientHeight / 2;
    const heightBound = boxHeight - knobHeightBias;
    const fillHeight = gainToFillHeight(gain);

    if (dragging) fillRef.current.classList.remove("smooth-transition");
    else fillRef.current.classList.add("smooth-transition");

    fillRef.current.style.maxHeight = heightBound + "px";
    fillRef.current.style.height = fillHeight + "px";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gain]);

  // To have some way of tweaking the bands in mobile devices.
  const handleClickSlide = (event) => {
    if (!playerContext.equalizer.isEnabled) return;
    const previousY = knobRef.current.getBoundingClientRect().top;
    const newFillHeight =
      fillRef.current.clientHeight + (previousY - event.clientY);
    const newGain = fillHeightToGain(newFillHeight);
    onBandTuned(index, newGain);
  };

  const handleDragStart = (event) => {
    if (!playerContext.equalizer.isEnabled) return;
    g_previousDragY = event.clientY;
    setDragging(true);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const clientY = event.clientY;
      const displacement = g_previousDragY - clientY;
      const newFillHeight = fillRef.current.clientHeight + displacement;
      const newGain = fillHeightToGain(newFillHeight);
      onBandTuned(index, newGain);
      g_previousDragY = clientY;
    }
  };

  const handleDragEnd = () => {
    if (dragging) setDragging(false);
  };

  const eqEnabled = playerContext.equalizer.isEnabled;
  return (
    <div
      className={"band-container"}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleDragEnd}
    >
      <div
        ref={boxRef}
        className={`box ${eqEnabled ? "enabled" : "disabled"}`}
        onMouseDown={handleClickSlide}
      >
        <div
          ref={fillRef}
          className={`fill ${eqEnabled ? "enabled" : "disabled"}`}
        >
          <div
            ref={knobRef}
            className={`knob ${eqEnabled ? "enabled" : "disabled"}`}
          ></div>
        </div>
      </div>
      <span>
        {playerContext.filterpackNode.getFilter(index).getFrequency()} Hz
      </span>
    </div>
  );
}
