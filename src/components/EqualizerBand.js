import {useRef} from "react";

const MAX_GAIN = 24; // dB

export default function EqualizerBand({filter}) {
    const boxRef = useRef();
    const fillRef = useRef();
    const knobRef = useRef();

    const gainToFillHeight = (gain, boxHeight, knobHeightBias) => {
        const step = (boxHeight - knobHeightBias) / (MAX_GAIN * 2);
        return (gain + MAX_GAIN) * step;
    }

    const fillHeightToGain = (fillHeight, boxHeight, knobHeightBias) => {
        const step = (boxHeight - knobHeightBias) / (MAX_GAIN * 2);
        return (fillHeight / step) - MAX_GAIN;
    }

    const applyLevel = (displacement) => {
        const boxHeight = boxRef.current.clientHeight;
        const knobHeightBias = knobRef.current.clientHeight / 2;
        const heightBound = boxHeight - knobHeightBias;
        const fillHeight = fillRef.current.clientHeight;
        fillRef.current.style.maxHeight = heightBound + 'px';
        fillRef.current.style.height = (fillHeight + displacement) + 'px';

        const gain = fillHeightToGain(fillHeight, boxHeight, knobHeightBias);
        console.log(gain);
        filter.setGain(gain);
    }

    // To have some way of tweaking the bands in mobile devices.
    const handleClickSlide = (event) => {
        const fillRect = fillRef.current.getBoundingClientRect();
        const displacement = fillRect.top - event.clientY;
        applyLevel(displacement);
    }

    let dragging = false;
    let previousClientY = 0;

    const handleDragStart = (event) => {
        previousClientY = event.clientY;
        dragging = true;
    }

    const handleDragEnd = () => {
        dragging = false;
    }

    const handleMouseMove = (event) => {
        if (dragging) {
            const clientY = event.clientY;
            const displacement = previousClientY - clientY;
            previousClientY = clientY;
            applyLevel(displacement);
        }
    }

    return (
        <div className={'band-container'}
             onMouseDown={handleDragStart}
             onMouseUp={handleDragEnd}
             onMouseMove={handleMouseMove}
             onMouseLeave={handleDragEnd}
        >
            <div ref={boxRef} className={'box'} onMouseDown={handleClickSlide}>
                <div ref={fillRef} className={'fill'}>
                    <div ref={knobRef} className={'knob'}></div>
                </div>
            </div>
            <h6>{filter.frequency} Hz</h6>
        </div>
    );
}