import {useRef} from "react";

export default function EqualizerBand({filter}) {
    const fillRef = useRef();
    const knobRef = useRef();

    const slide = (displacement) => {
        const boxElement = fillRef.current.parentNode;
        const upperBound = boxElement.clientHeight - 10;
        const fillHeight = Math.min(fillRef.current.clientHeight, upperBound);
        fillRef.current.style.height = (fillHeight + displacement) + 'px';

        const step = (boxElement.clientHeight) / 24;
        const level = -12 + (fillHeight + 10) / step;
        filter.setGain(level);
    }

    const handleSlide = (event) => {

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
            slide(displacement);
        }
    }

    return (
        <div className={'band-container'}
             onMouseDown={handleDragStart}
             onMouseUp={handleDragEnd}
             onMouseLeave={handleDragEnd}
             onMouseMove={handleMouseMove}
        >
            <div className={'box'}>
                <div ref={fillRef} className={'fill'} onClick={handleSlide}>
                    <div ref={knobRef} className={'knob'}></div>
                </div>
            </div>
            <h6>{filter.frequency} Hz</h6>
        </div>
    );
}