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
            isOpen: props.isOpen,
            item: null,
            id: props.id,
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

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Delete Item
                    </div>
                    <p>Are you sure you want to delete?</p>
                    <div>
                        <button onClick={() => {this.deleteItem()}}>Delete</button>
                    </div>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    };
};