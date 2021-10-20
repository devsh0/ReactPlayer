import {useContext} from "react";
import PlayerContext from "./PlayerContext";
import {BsFileEarmarkPlus, BsPlayFill, BsTrash, BsTrashFill} from "react-icons/bs";
import {AiOutlineFileAdd, AiOutlineFileExcel, IoMdClose, RiDeleteBin7Line} from "react-icons/all";

export default function PlaylistView() {
    const playerContext = useContext(PlayerContext);

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
            <div className={'overlay'}></div>
            <div className={'header-container'}>
                <input className={'input search'} type={'text'} placeholder={'Search...'}/>
                <div className={'button-container'}>
                    <button className={'btn add-song'}>Add<AiOutlineFileAdd/></button>
                    <button className={'btn add-song'}>Clear<AiOutlineFileExcel/></button>
                </div>
            </div>
            <div className={'playlist-container'}>
                {getSongs(20)}
            </div>

        </div>
    );
}