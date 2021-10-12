import {useRef} from "react";

export default function EqualizerBand({filter}) {
    const fillRef = useRef();
    const knobRef = useRef();

    const slide = (displacement) => {
        const upperBound = fillRef.current.parentNode.clientHeight - 10;
        const height = Math.min(fillRef.current.clientHeight, upperBound);
        fillRef.current.style.height = (height + displacement) + 'px';
    }

    const handleSlide = (event) => {

    }

    let dragging = false;
    let previousClientY = 0;

    const dragStart = (event) => {
        previousClientY = event.clientY;
        dragging = true;
    }

    const dragEnd = () => {
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

    /*<input type='range' max={12} min={-12} step={1} value={value} onChange={handleSlide}/>*/
    return (
        <div className={'band-container'}
             onMouseDown={dragStart}
             onMouseUp={dragEnd}
             onMouseLeave={dragEnd}
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