import {useContext, useRef} from "react";
import PlayerContext from "./PlayerContext";
import {AiOutlineFileAdd, AiOutlineFileExcel, IoMdClose} from "react-icons/all";

window.addEventListener('error', (ev => alert(ev.message)), true);

export default function PlaylistView() {
    const playerContext = useContext(PlayerContext);
    const dummyInputRef = useRef();

    function handleAudioInput() {
        dummyInputRef.current.click();
    }

    function handleFileSelect() {
        console.log('File was selected');
        const input = dummyInputRef.current;
        const audio = new Audio();
        audio.oncanplay = () => {
            alert('Can play now');
            audio.play();
        }
        console.log('Are we even here?');
        for (const file of input.files) {
            audio.className = 'dummy';
            audio.src = URL.createObjectURL(file);
            //audio.src = URL.createObjectURL(file);
        }
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