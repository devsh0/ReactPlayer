import {useContext, useRef} from "react";
import PlayerContext from "./PlayerContext";
import {IoMdClose} from "react-icons/all";
import {fileToMediaResource, getFormattedMediaName, getFormattedMediaTime} from "./Utils";

export default function PlaylistView(props) {
    const playerContext = useContext(PlayerContext);
    const dummyInputRef = useRef();

    function handleAudioInput() {
        dummyInputRef.current.click();
    }

    // Fixme: Callback won't be invoked if this batch of selected files
    //  doesn't differ from the last batch of selected files. So if someone
    //  decided to remove everything from the playlist and then add the same
    //  files again, nothing will be added. Everything's good if the current
    //  batch differs from the last batch even by just one file.
    function handleFileSelect() {
        const input = dummyInputRef.current;
        fileToMediaResource(input.files).then((mediaResources) => {
            props.onMediaResourceLoaded(mediaResources);
        });
    }

    function handleAudioRemoved(event, media) {
        event.stopPropagation();
        props.onAudioRemoved(media);
    }

    function getAudioRows() {
        let audioList = [];
        const session = playerContext.session;
        for (const media of session.playlist) {
            const current = session.currentMedia;
            const playingThis = current && current.equals(media);
            const extraClasses = playingThis ? 'current' : '';

            audioList.push((
                <div key={media.id} className={`row ${extraClasses}`} onClick={() => props.onAudioSelected(media)}>
                    <div className={'title'}>{getFormattedMediaName(media.name)}</div>
                    <div className={'metadata'}>
                        <span className={'duration'}>{getFormattedMediaTime(media.duration)}</span>
                        <button className={'remove'} onClick={(e) => handleAudioRemoved(e, media)}><IoMdClose/></button>
                    </div>
                </div>
            ));
        }
        return audioList;
    }

    return (
        <div className={'component playlist'}>
            <input ref={dummyInputRef} multiple className={'dummy'} type={'file'} accept={'audio/*'}
                   onChange={handleFileSelect}/>
            <div className={'overlay'}></div>
            <div className={'header-container'}>
                <input className={'input search'} type={'text'} placeholder={'Search...'}/>
                <div className={'button-container'}>
                    <button className={'btn add-song'} onClick={handleAudioInput}>Add</button>
                    <button className={'btn remove-song'} onClick={props.onPlaylistCleared}>Clear</button>
                </div>
            </div>
            <div className={'playlist-container'}>
                {getAudioRows()}
            </div>
        </div>
    );
}