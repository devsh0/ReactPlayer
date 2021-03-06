import React, { useContext, useEffect, useRef } from "react";
import PlayerContext from "./PlayerContext";

export default function VisualizerView() {
  const playerContext = useContext(PlayerContext);
  const canvasRef = useRef();
  const canvasParentRef = useRef();
  const playingRef = useRef();
  playingRef.current = playerContext.isPlaying;

  function getFrequencySamples(analyser) {
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;
    const freqPoints = analyser.frequencyBinCount;
    const data = new Uint8Array(freqPoints);
    analyser.getByteFrequencyData(data);
    return data;
  }

  useEffect(() => {
    function clearRAF() {
      let id = requestAnimationFrame(() => {});
      while (id--) cancelAnimationFrame(id);
    }

    // Clean up previously scheduled RAFs so that Firefox doesn't go nuts.
    clearRAF();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const origin = { x: width / 2, y: height / 2 };

    function clamp(input, min, max) {
      if (input < min) return min;
      if (input > max) return max;
      return input;
    }

    function draw() {
      if (playingRef.current) {
        const frequencySamples = getFrequencySamples(
          playerContext.analyserNode
        );
        context.clearRect(0, 0, width, height);
        const bufferLength = frequencySamples.length;
        const radialStep = (2 * Math.PI) / 140;
        const weight = 0.5;
        for (let i = 0; i < bufferLength; i++) {
          const magnitude = frequencySamples[i];
          const length = clamp(magnitude * weight, 10, 200);
          const xCoordinate = length * Math.cos(radialStep * i);
          const yCoordinate = length * Math.sin(radialStep * i);
          context.beginPath();
          context.moveTo(origin.x, origin.y);
          context.lineTo(origin.x + xCoordinate, origin.y + yCoordinate);
          context.strokeStyle = `#fff`;
          context.lineWidth = 2;
          context.stroke();
        }

        requestAnimationFrame(draw);
      }
    }

    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerContext.isPlaying]);

  return (
    <div ref={canvasParentRef} className={"component visualizer"}>
      <div className={"overlay"}></div>
      <canvas ref={canvasRef} width={200} height={200}>
        No canvas support
      </canvas>
      <div className={"center-background"}></div>
    </div>
  );
}
