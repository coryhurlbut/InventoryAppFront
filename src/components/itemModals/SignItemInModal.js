import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    itemLogController }     from '../../controllers';
import { ViewNoteModal }   from '../logModals';
import MapNotes             from '../utilities/MapNotes';

/*
*   Modal for signing an item in, which also has functionality to view notes of items being signed out
*/
const VIEW_NOTES = 'View Notes';

const MODAL_HEADER_TITLE = 'Sign Item In';
const MODAL_PROMPT = 'You are about to sign back in:';

const BTN_SUBMIT = 'Submit';
const BTN_CLOSE = 'Close';

export default class SignItemInModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen              : props.isOpen,
            modal               : null,
            isError             : false,
            errorMessage        : ''
        };
        this._selectedIds = props.selectedIds;
        this._selectedObjects = props.selectedObjects;
    };

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    //function to make database call, changing 'available' field on item to false, thus making it signed out
    _signItemsIn = async () => {
        await itemController.signItemIn(this._selectedIds)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            
            this.setState({ 
                isError:      false,
                errorMessage: ''
            });
            //we need to loop since there is a strong possibility of multiple items being deleted
            //which each require a log event
            for(let i = 0; i < this._selectedIds.length; i++) {
                let info = {
                    itemId      : this._selectedIds[i],
                    userId      : 'test',
                    custodianId : '',
                    action      : 'signed in',
                    notes       : 'test'
                };
                await itemLogController.createItemLog(info);
            };

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ 
                isError: true,
                errorMessage: "An error occured while loading. Please refresh and try again."
            });
        });
    }

    //calls viewnote modal component ontop of sign item out modal
    _openNotesModal = (Event, buttonClicked) => {
        this.setState({
            modal: <ViewNoteModal 
                selectedIds={this._selectedIds}
                selectedObjects={this.selectedObjects}
                isOpen={true} 
                content={MapNotes(buttonClicked)} 
                name={`${Event.target.id}`} 
                hideModal={this._hideModal}
                />
        });
    }
    _hideModal = () => {
        this.setState({modal: null});
    }

    /* Loops through the array of items and displays them as a list */
    _displayArray = (items) => {
        try {
            const displayItem = items.map((item) => {
                return (
                    <span className='displayItemsAndViewNotes' key={item._id}>
                        <li className="arrayObject"> 
                            {item.itemNumber} : {item.name}
                        </li>
                        <button 
                            type='button'
                            className='signinSignout'
                            id={item.itemNumber} 
                            onClick={Event => this._openNotesModal(Event, item.notes)}
                        >
                            {VIEW_NOTES}
                        </button>
                    </span>
                );
            });
    
            return <ul>{displayItem}</ul>;
        } catch (error) {
            alert("An error has occured. Contact Admin.");
        }
    }

    /* Builds display for deleting items */
    _renderSignInNotification = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_TITLE}</h3>
                </div>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <h4>{MODAL_PROMPT}</h4>
                    {this._displayArray(this._selectedObjects)}
                </div>
                {this.state.modal}
                <div className="modalFooter">
                    <button onClick={this._signItemsIn}>{BTN_SUBMIT}</button>
                    <button onClick={this._dismissModal}>{BTN_CLOSE}</button>
                </div>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.errorMessage}
            </label>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this._renderSignInNotification()}
            </Modal>
        );
    }
}