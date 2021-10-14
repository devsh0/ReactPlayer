import {useEffect, useRef, useState} from "react";

const MAX_GAIN = 12; // dB
let g_previousDragY = 0;

export default function EqualizerBand({filter, filterGain, onBandTuned}) {
    const [dragging, setDragging] = useState(false);
    const [gain, setGain] = useState(filterGain);
    const boxRef = useRef();
    const fillRef = useRef();
    const knobRef = useRef();

    const gainToFillHeight = (gain) => {
        const boxHeight = boxRef.current.clientHeight;
        const knobHeightBias = knobRef.current.clientHeight / 2;
        const step = (boxHeight - knobHeightBias) / (MAX_GAIN * 2);
        return (gain + MAX_GAIN) * step;
    }

    const fillHeightToGain = (fillHeight) => {
        const boxHeight = boxRef.current.clientHeight;
        const knobHeightBias = knobRef.current.clientHeight / 2;
        const step = (boxHeight - knobHeightBias) / (MAX_GAIN * 2);
        return (fillHeight / step) - MAX_GAIN;
    }

    useEffect(() => {
        const boxHeight = boxRef.current.clientHeight;
        const knobHeightBias = knobRef.current.clientHeight / 2;
        const heightBound = boxHeight - knobHeightBias;
        const fillHeight = gainToFillHeight(gain);
        fillRef.current.style.maxHeight = heightBound + 'px';
        fillRef.current.style.height = fillHeight + 'px';
        filter.setGain(gain);
    }, [gain])

    useEffect(() => {
        setGain(filterGain);
    }, [filterGain])

    // To have some way of tweaking the bands in mobile devices.
    const handleClickSlide = (event) => {
        const previousY = knobRef.current.getBoundingClientRect().top;
        const newFillHeight = fillRef.current.clientHeight + (previousY - event.clientY);
        const newGain = fillHeightToGain(newFillHeight);
        setGain(newGain);
        onBandTuned();
    }

    const handleDragStart = (event) => {
        g_previousDragY = event.clientY;
        setDragging(true);
    }

    const handleMouseMove = (event) => {
        if (dragging) {
            const clientY = event.clientY;
            const displacement = g_previousDragY - clientY;
            const newFillHeight = fillRef.current.clientHeight + displacement;
            const newGain = fillHeightToGain(newFillHeight);
            setGain(newGain);
            g_previousDragY = clientY;
        }
    }

    const handleDragEnd = () => {
        if (dragging) {
            setDragging(false);
            onBandTuned();
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