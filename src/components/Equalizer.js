import EqualizerBand from "./EqualizerBand";
import PresetContainer from "./PresetContainer";

export default function Equalizer({filterpack}) {
    return (
        <div className={'equalizer'}>
            <PresetContainer />
            <div className={'band-array-container'}>
                <EqualizerBand filter={filterpack.filterArray[0]}/>
                <EqualizerBand filter={filterpack.filterArray[1]}/>
                <EqualizerBand filter={filterpack.filterArray[2]}/>
                <EqualizerBand filter={filterpack.filterArray[3]}/>
                <EqualizerBand filter={filterpack.filterArray[4]}/>
                <EqualizerBand filter={filterpack.filterArray[5]}/>
                <EqualizerBand filter={filterpack.filterArray[6]}/>
                <EqualizerBand filter={filterpack.filterArray[7]}/>
                <EqualizerBand filter={filterpack.filterArray[8]}/>
                <EqualizerBand filter={filterpack.filterArray[9]}/>
            </div>
        </div>
    )
}
