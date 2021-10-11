export default function SeekSlider ({controllerState, onSeek}) {
    return (
        <div>
        <input type='range' max={controllerState.duration} step='1'
               value={controllerState.position}
               onChange={event => onSeek(event.target.value)}/>
            <p>{controllerState.position}</p>
        </div>
    );
}