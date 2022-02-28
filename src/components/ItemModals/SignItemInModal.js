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
            idArray: props.idArray
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
        
        await itemController.signItemIn(this.state.idArray);
        await itemLogController.createItemLog(info);
        window.location.reload(false);
        this.dismissModal();
    };

    /* Loops through the array of items and displays them as a list */
    displayArray(idArray){
        const displayID = idArray.map(
            (idArray) => <li key={ idArray.toString() } > { idArray } </li>);

        return(
            <ul> { displayID } </ul>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
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
            </Modal>
        );
    };
};