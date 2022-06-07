import React from "react";

/**
 * A component to return table config buttons, takes account role as props to properly config
 */

const BTN_AVAILABLE_ITEMS_TABLE = 'Available Items';
const BTN_UNAVAILABLE_ITEMS_TABLE = 'Unavailable Items';
const BTN_USER_TABLE = 'Users';

export default function TableNav ({...props}) {
    return(
        <div id="tableNavigation">
            <button 
                onClick={() => {props.clickFunction('availableItems')}}
            >
                {BTN_AVAILABLE_ITEMS_TABLE}
            </button>
            <div className="itemStyling">|</div>
            <button 
                onClick={() => {props.clickFunction('unavailableItems')}}
            >
                {BTN_UNAVAILABLE_ITEMS_TABLE}
            </button>
            {props.isUserContentVisible ? 
                <div className="itemStyling">
                    |
                </div> : null}
            {props.isUserContentVisible ? 
                <button onClick={() => {props.clickFunction('users')}}>
                    {BTN_USER_TABLE}
                </button> : 
                null
            }
        </div>
    )
}