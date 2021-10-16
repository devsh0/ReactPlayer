import React, {useEffect, useRef} from "react";

export default function Visualizer({playing, analyser}) {
    const canvasFilledRef = useRef(false);
    const canvasRef = useRef();
    const playingRef = useRef();
    playingRef.current = playing;

    function getFrequencySamples(analyser) {
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = .8;
        const freqPoints = analyser.frequencyBinCount;
        const data = new Uint8Array(freqPoints);
        analyser.getByteFrequencyData(data);
        return data;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const width = canvas.clientWidth, height = canvas.clientHeight;
        context.fillStyle = '#14182c';
        if (!canvasFilledRef.current) {
            context.fillRect(0, 0, width, height);
            canvasFilledRef.current = true;
        }

        function draw() {
            if (playingRef.current) {
                context.clearRect(0, 0, width, height);
                context.fillStyle = '#14182c';
                context.fillRect(0, 0, width, height);
                const frequencySamples = getFrequencySamples(analyser);
                const bufferLength = frequencySamples.length;
                const barWidth = (width / bufferLength);
                let barHeight = 0;
                let x = 0;

                for(let i = 0; i < bufferLength; i++) {
                    barHeight = frequencySamples[i] * 1.5;
                    const gradient = context.createLinearGradient(x + (barWidth / 2), (height - (barHeight / 5)),  x + (barWidth / 2), 0);
                    gradient.addColorStop(.4, '#262c4b');
                    gradient.addColorStop(.6, '#3978b6');
                    gradient.addColorStop(.8, '#7894d9');
                    context.fillStyle = gradient;
                    context.fillRect(x, (height - (barHeight / 2) - 80), barWidth, barHeight);
                    x += barWidth + (1.4);
                }
                requestAnimationFrame(draw);
            }
        }

        draw();
    }, [playing]);

    return (
        <div className={'viz-container'}>
            <canvas ref={canvasRef}> </canvas>
        </div>
    );
}