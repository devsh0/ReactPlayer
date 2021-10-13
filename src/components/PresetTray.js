export default function PresetTray({show}) {
    return (
        <div className={`preset-tray ${show || 'hidden'}`}>
            <div className={'item'}>Custom</div>
            <div className={'item'}>Bass</div>
            <div className={'item'}>Treble</div>
            <div className={'item selected'}>Pop</div>
            <div className={'item'}>Rock</div>
            <div className={'item'}>Jazz</div>
            <div className={'item'}>Folk</div>
            <div className={'item'}>Party</div>
        </div>
    )
}