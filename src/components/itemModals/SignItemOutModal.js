import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController, 
        itemLogController,
        userController }    from '../../controllers';
import { ViewNoteModal }   from '../logModals';
import MapNotes             from '../utilities/MapNotes';

/*
*   Modal for signing out an item
*/
const VIEW_NOTES = 'View Notes';

const MODAL_HEADER_TITLE = 'Sign Item Out';
const MODAL_HEADER_ERROR_TITLE = 'Error Has Occured';

const MODAL_PROMPT = 'You are about to sign out: ';
const CHOOSE_USER_PROMPT = 'Choose a user:';

const BTN_CLOSE = 'Close';

export default class SignItemOutModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen                  : props.isOpen,
            users                   : [],
            userId                  : null,
            userName                : '',
            modal                   : null,
            isControllerError       : false,
            controllerErrorMessage  : '',
            isError                 : false,
            errorMessage            : ''
        };
        this._selectedIds = props.selectedIds;
        this._selectedObjects = props.selectedObjects;
    }
    //must make a database call of all active users to populate dropdown to select who signs what out
    async componentDidMount(){
        try {
            let users = await userController.getAllActiveUsers();
            this.setState({ 
                users                   : users, 
                isControllerError       : false, 
                controllerErrorMessage  : '' 
            });
            this._assignOptionGroup();
        } catch(error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ 
                isControllerError: true,
                controllerErrorMessage: "An error occured while loading. Please refresh and try again."
            });
        };
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    //database call to change 'available' field to true, thus making the item available again
    _signItemsOut = async () => {
        await itemController.signItemOut(this._selectedIds, this.state.userName)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ 
                isError: false,
                errorMessage: ''
            });
            //we need to loop since there is a strong possibility of multiple items being deleted
            //which each require a log event
            for(let i = 0; i < this._selectedIds.length; i++) {
                let info = {
                    itemId      : this._selectedIds[i],
                    userId      : this.state.userId,
                    custodianId : '',
                    action      : 'signed out',
                    notes       : 'test'
                };
                await itemLogController.createItemLog(info);
            };

            window.location.reload();
            this._dismissModal();
        })
        .catch((error) => {            
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ 
                isError: true,
                errorMessage: error.message 
            });
        });
    }

    //method that dynamically generates child option tags to grp option tags in the render 
    _assignOptionGroup = () => {
        for(let i = 0; i < this.state.users.length; i++) {
            const { userName, userRole, _id } = this.state.users[i];

            let option = document.createElement("option");
                option.append(userName);
                option.setAttribute("key", _id)

            if(userRole === "user") {
                document.getElementById("userGroup").append(option);
            } else if(userRole === "admin") {
                document.getElementById("adminGroup").append(option);
            } else if(userRole === "custodian") {
                document.getElementById("custodianGroup").append(option);
            };
        };
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
                            id={item.itemNumber.toString()} 
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

    /* Useability Feature:
        submit button is only enabled when no errors are detected */
    _isSumbitAvailable = () => {
        if(this.state.userId !== null) return true;
        return false;
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._signItemsOut();
    }

    _handleDropdownChange = (event) => {
        this.setState({ 
            userName: event.target.value, 
            userId: event.target.options[event.target.options.selectedIndex].attributes.key.value
        });/*This grabs the key attribute from the selected option*/ 
    }

    /* Builds display for deleting items */
    _renderSignOutNotification = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_TITLE}</h3>                    
                </div>
                <form onSubmit={this._handleFormSubmit}>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <h4>{MODAL_PROMPT}</h4>
                    {this._displayArray(this._selectedObjects)}
                    <span className='userSelectSigninSignout'>
                        <label id='labelSelectSignout'>{CHOOSE_USER_PROMPT}</label>
                        <select 
                            name="usersSelect" 
                            id="usersSelect" 
                            defaultValue={""} 
                            onChange={this._handleDropdownChange} 
                        > 
                            <option label="" hidden disabled />
                            <optgroup label="Users" id="userGroup" />
                            <optgroup label="Custodians" id="custodianGroup" />
                            <optgroup label="Admins" id="adminGroup" />
                        </select>
                    </span>
                </div>
                {this.state.modal}
                <div className="modalFooter">
                    <input 
                        type="submit" 
                        value="Submit" 
                        disabled={!this._isSumbitAvailable()}
                    />
                    <button type="reset" onClick={this._dismissModal}>{BTN_CLOSE}</button>
                </div>
                </form>
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

    /* If a backend issue occurs, display message to user */
    _renderErrorDisplay = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_ERROR_TITLE}</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">{this.state.controllerErrorMessage}</p>
                </div>
                <div className="modalFooter">
                    <button type="reset" onClick={this._dismissModal}>{BTN_CLOSE}</button>
                </div>
            </>
        );
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this.state.isControllerError ? 
                    this._renderErrorDisplay() : 
                    this._renderSignOutNotification()
                }
            </Modal>
        );
    }
}