export default function SeekSlider ({controllerState, onSetPosition}) {
    return (
        <div>
        <input type='range' max={controllerState.duration} step='1'
               value={controllerState.position}
               onChange={(e) => onSetPosition(e.target.value)}/>
            <p>{controllerState.position}</p>
        </div>
    );
}