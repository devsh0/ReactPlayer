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
        const radialGradient = context.createRadialGradient(0, 0, 10, width - 300, height - 300, 300);
        radialGradient.addColorStop(0, '#333');
        radialGradient.addColorStop(.5, '#484646');
        radialGradient.addColorStop(.8, 'black')
        context.fillStyle = radialGradient;
        if (!canvasFilledRef.current) {
            context.fillRect(0, 0, width, height);
            canvasFilledRef.current = true;
        }

        function draw() {
            if (playingRef.current) {
                context.clearRect(0, 0, width, height)
                context.fillStyle = radialGradient;
                context.fillRect(0, 0, width, height);
                const frequencySamples = getFrequencySamples(analyser);
                const bufferLength = frequencySamples.length;
                const barWidth = (width / bufferLength);
                let barHeight = 0;
                let x = 0;

                for(let i = 0; i < bufferLength; i++) {
                    barHeight = .7 * frequencySamples[i];
                    const linearGradient = context.createLinearGradient(x + (barWidth / 2), (height - (barHeight / 5)),  x + (barWidth / 2), 0);
                    linearGradient.addColorStop(.4, '#25254d');
                    linearGradient.addColorStop(.6, '#333d7a');
                    linearGradient.addColorStop(.8, '#83878f');
                    context.fillStyle = linearGradient;
                    const baseline = height / 2;
                    const verticalOffset = baseline - (barHeight / 2);
                    context.fillRect(x, verticalOffset, barWidth, barHeight / 2);
                    x += barWidth + (1.4);
                }
                requestAnimationFrame(draw);
            }
        }

        draw();
    }, [playing]);

    return (
        <div className={'component visualizer active'}>
            <canvas ref={canvasRef}> </canvas>
        </div>
    );
}