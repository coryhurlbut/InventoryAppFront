import React from 'react';
import {Modal} from '@fluentui/react';
import itemController from '../../controllers/ItemController';
import itemLogController from '../../controllers/ItemLogController';

/*
*   Modal for signing an item in
*/
export default class SignItemInModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:  props.isOpen,
            item:    null,
            idArray: props.idArray,

            isControllerError:      false,
            controllerErrorMessage: ''
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.signItemsIn = this.signItemsIn.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async signItemsIn(){
        let info = {
            itemId:      this.state.idArray[0],
            userId:      'test',
            custodianId: '',
            action:      'signed in',
            notes:       'test'
        }
        try {
            await itemController.signItemIn(this.state.idArray);
            await itemLogController.createItemLog(info);
            window.location.reload(false);
            this.dismissModal();
        } catch (error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ isControllerError: true,
                            controllerErrorMessage: "An error occured while loading. Please refresh and try again."});
        }
    };

    /* Loops through the array of items and displays them as a list */
    displayArray(idArray){
        const displayID = idArray.map(
            (idArray) => <li key={ idArray.toString() } > { idArray } </li>);

        return(
            <ul> { displayID } </ul>
        );
    };

    /* Builds display for deleting items */
    buildSignInNotification(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Sign Item In</h3>
            </div>
            <div className='modalBody'>
                <h4>You are about to sign back in:</h4>
                {this.displayArray(this.state.idArray)}
            </div>
            <div className='modalFooter'>
                <button onClick={this.signItemsIn}>Submit</button>
                <button onClick={this.dismissModal}>Close</button>
            </div>
            </>
        );
    };

    /* If a backend issue occurs, display message to user */
    buildErrorDisplay(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Error Has Occured</h3>
            </div>
            <div className='modalBody'>
                <p className='errorMesage'> {this.controllerErrorMessage} </p>
            </div>
            <div className='modalFooter'>
                <button type="reset" onClick={() => this.dismissModal()}>Close</button>
            </div>
            </>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                { this.isControllerError ? this.buildErrorDisplay() : this.buildSignInNotification() }
            </Modal>
        );
    };
};