import {useContext, useRef} from "react";
import PlayerContext from "./PlayerContext";
import {AiOutlineFileAdd, AiOutlineFileExcel, IoMdClose} from "react-icons/all";
import {fileToMediaResource} from "./Utils";

export default function PlaylistView({onMediaResourceLoaded}) {
    const playerContext = useContext(PlayerContext);
    const dummyInputRef = useRef();

    function handleAudioInput() {
        dummyInputRef.current.click();
    }

    function handleFileSelect() {
        const input = dummyInputRef.current;
        fileToMediaResource(input.files).then((mediaResources) => {
            onMediaResourceLoaded(mediaResources);
        });
    }

    function getSongs(howMany) {
        let songs = [];
        for (let i = 0; i < howMany; i++) {
            songs.push((
                <div className={'row'}>
                    <div className={'title'}>Here goes the name of the song</div>
                    <div className={'metadata'}>
                        <span className={'duration'}>03:40</span>
                        <button className={'remove'}><IoMdClose/></button>
                    </div>
                </div>
            ));
        }
        return songs;
    }

    return (
        <div className={'component playlist'}>
            <input ref={dummyInputRef} multiple className={'dummy'} type={'file'} accept={'audio/*'}
                   onChange={handleFileSelect}/>
            <div className={'overlay'}></div>
            <div className={'header-container'}>
                <input className={'input search'} type={'text'} placeholder={'Search...'}/>
                <div className={'button-container'}>
                    <button className={'btn add-song'} onClick={handleAudioInput}>Add<AiOutlineFileAdd/></button>
                    <button className={'btn add-song'}>Clear<AiOutlineFileExcel/></button>
                </div>
            </div>
            <div className={'playlist-container'}>
                {getSongs(20)}
            </div>
        </div>
    );
}