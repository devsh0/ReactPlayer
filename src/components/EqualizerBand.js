import {useRef} from "react";

export default function EqualizerBand({filter}) {
    const fillRef = useRef();
    const knobRef = useRef();

    const applyLevel = (displacement) => {
        const boxElement = fillRef.current.parentNode;
        const knobHeightBias = knobRef.current.clientHeight / 2;
        const heightBound = boxElement.clientHeight - knobHeightBias;
        const fillHeight = fillRef.current.clientHeight;
        fillRef.current.style.maxHeight = heightBound + 'px';
        fillRef.current.style.height = (fillHeight + displacement) + 'px';

        const step = (boxElement.clientHeight) / 24;
        const level = -12 + (fillHeight + knobHeightBias) / step;
        filter.setGain(level);
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
            <div className={'box'} onMouseDown={handleClickSlide}>
                <div ref={fillRef} className={'fill'}>
                    <div ref={knobRef} className={'knob'}></div>
                </div>
            </div>
            <h6>{filter.frequency} Hz</h6>
        </div>
    );
}