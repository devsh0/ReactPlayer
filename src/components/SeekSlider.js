import {useEffect, useRef} from "react";

export default function SeekSlider({controllerState, onSeek}) {
    const overlay = useRef();
    const inputRef = useRef();

    useEffect(() => {
        if (controllerState.position === 0) {
            overlay.current.style.width = 0;
            return;
        }

        const newWidth = (inputRef.current.clientWidth / (controllerState.duration / controllerState.position)) + 1
        overlay.current.style.width = newWidth + 'px';
    }, [controllerState.position])

    return (
        <div className={'seek-slider-container'}>
            <div ref={overlay} className={'played-segment'}></div>
            <input ref={inputRef} className={'progress'}
                   type='range' max={controllerState.duration} step='1'
                   value={controllerState.position}
                   onChange={event => onSeek(event.target.value)}/>
        </div>
    );
}