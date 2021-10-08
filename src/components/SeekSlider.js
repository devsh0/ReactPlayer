import React from "react";
import PlayerContext from "./PlayerContext";

export default class SeekSlider extends React.Component {
    /*static contextType = PlayerState;*/

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        console.log(this.context);
    }

    render() {
        return (
            <div className={"seek-slider"}>
                <input type="range" min="1" max="100" step="1"/>
            </div>
        );
    }
}

SeekSlider.contextType = PlayerContext;