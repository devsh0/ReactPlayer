import {useContext, useRef} from "react";
import PlayerContext from "./PlayerContext";
import {AiOutlineFileAdd, AiOutlineFileExcel, IoMdClose} from "react-icons/all";
import {AudioFile} from "./Session";

const audioFiles = [];
export default function PlaylistView() {
    const playerContext = useContext(PlayerContext);
    const dummyInputRef = useRef();

    function handleAudioInput() {
        dummyInputRef.current.click();
    }

    function handleFileSelect() {
        const input = dummyInputRef.current;
        const files = input.files;
        let index = 0;

        // Collect metadata for each of the selected media.
        const audio = new Audio();
        audio.addEventListener('loadedmetadata', () => {
            if (index < files.length - 1) {
                loadMeta(files[index]);
            } else {
                console.log('All files loaded!');
            }
        })

        function loadMeta(file) {
            const media = URL.createObjectURL(file);
            audioFiles.push(new AudioFile(media, file.name, audio.duration));
            audio.src = URL.createObjectURL(files[++index]);
        }

        audio.src = URL.createObjectURL(files[index]);
    }

    function kickAPlay() {
        if (audioFiles.length === 0) {
            console.log('Nothing to play!');
            return;
        }
        const index = Math.floor(Math.random() * audioFiles.length);
        const file = audioFiles[index];
        console.log('About to be played...');
        file.dump();
        const audio = new Audio();
        audio.addEventListener('canplay', () => {
            audio.play();
        })
        audio.src = file.object;
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
            <button onClick={kickAPlay}>Play Now</button>
        </div>
    );
}