import React from "react";

import "../styles/ToggleSwitch.css";

const ToggleSwitch = () => {
    return (
        <div className="toggleSwitchContainer">
            <div className="toggleSwitch">
                <input 
                    type="checkbox" 
                    className="checkbox"
                    name='lightDark' 
                    id='lightDark'
                />
                <label className="label" htmlFor='lightDark' >
                    <span className="inner" />
                    <span className="switch" />
                </label>
            </div>
        </div>
    );
};

export default ToggleSwitch;
