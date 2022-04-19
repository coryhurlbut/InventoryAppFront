import React from "react";

export default function TableNav ({...props}) {

    return(
    <div id="tableNavigation">
        <button 
            onClick={() => {props.clickFunction('availableItems')}}
        >
            Available Items
        </button>
        <div className="itemStyling">|</div>
        <button 
            onClick={() => {props.clickFunction('unavailableItems')}}
        >
            Unavailable Items
        </button>
        {props.isUserContentVisible ? <div className="itemStyling">|</div> : null}
        {props.isUserContentVisible ? 
            <button 
                onClick={() => {props.clickFunction('users')}}
            >
                Users
            </button> : 
            null
        }
    </div>
    )
}