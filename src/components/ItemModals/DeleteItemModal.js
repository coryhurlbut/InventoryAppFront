import React from 'react';
import {Modal} from '@fluentui/react';
import itemController from '../../controllers/ItemController';

/*
*   Modal for deleting an item
*/
export default class DeleteItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:  props.isOpen,
            item:    null,
            idArray: props.idArray
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async deleteItem() {
        await itemController.deleteItems(this.state.idArray);
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
                    <h3>Delete Item</h3>
                </div>
                <div className='modalBody'>
                    <h4>You are about to delete the following:</h4>
                    {this.displayArray(this.state.idArray)}
                </div>
                <div className='modalFooter'>
                    <button onClick={() => {this.deleteItem()}}>Delete</button>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
            </Modal>
        );
    };
};