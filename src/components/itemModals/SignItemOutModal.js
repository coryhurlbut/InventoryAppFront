import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController, 
        itemLogController,
        userController }    from '../../controllers';

/*
*   Modal for signing out an item
*/
export default class SignItemOutModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:                 props.isOpen,
            users:                  [],
            userId:                 null,
            userName:               '',
            isControllerError:      false,
            controllerErrorMessage: ''
        };

        this._idArray = props.idArray;
        this._selectedObjects = props.selectedObjects;
    }

    async componentDidMount(){
        try {
            let users = await userController.getAllActiveUsers();
            this.setState({ users: users });
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

    _signItemsOut = async () => {
        await itemController.signItemOut(this._idArray, this.state.userName)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ 
                controllerErrorMessage: '', 
                isControllerError: false 
            });

            for(let i = 0; i < this._idArray.length; i++) {
                let info = {
                    itemId:      this._idArray[i],
                    userId:      this.state.userId,
                    custodianId: '',
                    action:      'signed out',
                    notes:       'test'
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
                isControllerError: true,
                controllerErrorMessage: error.message 
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

    /* Loops through the array of items and displays them as a list */
    _displayArray = (items) => {
        const displayItem = items.map((item) => {
            return <li className="arrayObject" key={item._id}> 
                {item.name} 
            </li>
        });

        return <ul>{displayItem}</ul>;
    }

    /* Useability Feature:
        submit button is only enabled when no errors are detected */
    _isSumbitAvailable = () => {
        if(this.state.userId !== null) return true;
        return false;
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._editItem();
    }

    _handleDropdownChange = (event) => {
        this.setState({ 
            userName: event.target.value, 
            userId: event.target.options[event.target.options.selectedIndex].attributes.key.value
        });/*This grabs the key attribute from the selected option*/ 
    }


    /* Builds display for deleting items */
    _buildSignOutNotification = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Sign Item Out</h3>                    
                </div>
                <form onSubmit={this._handleFormSubmit}>
                <div className="modalBody">
                    <h4>You are about to sign out: </h4>
                    {this._displayArray(this._selectedObjects)}
                    <label>Choose a user: </label>
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
                </div>
                <div className="modalFooter">
                    <input 
                        type="submit" 
                        value="Submit" 
                        disabled={!this._isSumbitAvailable()}
                    />
                    <button type="reset" onClick={this._dismissModal}>Close</button>
                </div>
                </form>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    _buildErrorDisplay = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Error Has Occured</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">{this.state.controllerErrorMessage}</p>
                </div>
                <div className="modalFooter">
                    <button type="reset" onClick={this._dismissModal}>Close</button>
                </div>
            </>
        );
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this.state.isControllerError ? this._buildErrorDisplay() : this._buildSignOutNotification()}
            </Modal>
        );
    }
}