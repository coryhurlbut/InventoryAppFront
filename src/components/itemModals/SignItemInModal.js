import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    itemLogController }     from '../../controllers';

/*
*   Modal for signing an item in
*/
export default class SignItemInModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:  props.isOpen,
            isControllerError:      false,
            controllerErrorMessage: ''
        };

        this._idArray = props.idArray;
        this._selectedObjects = props.selectedObjects;
    };

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _signItemsIn = async () => {
        await itemController.signItemIn(this._idArray)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ 
                controllerErrorMessage: '', 
                isControllerError: false 
            });

            for(let i = 0; i < this.state.idArray.length; i++) {
                let info = {
                    itemId:      this.state.idArray[0],
                    userId:      'test',
                    custodianId: '',
                    action:      'signed in',
                    notes:       'test'
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
                isControllerError: true,
                controllerErrorMessage: "An error occured while loading. Please refresh and try again."
            });
        });
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

    /* Builds display for deleting items */
    _buildSignInNotification = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Sign Item In</h3>
                </div>
                <div className="modalBody">
                    <h4>You are about to sign back in:</h4>
                    {this._displayArray(this._selectedObjects)}
                </div>
                <div className="modalFooter">
                    <button onClick={this._signItemsIn}>Submit</button>
                    <button onClick={this._dismissModal}>Close</button>
                </div>
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
                {this.state.isControllerError ? this._buildErrorDisplay() : this._buildSignInNotification()}
            </Modal>
        );
    }
}