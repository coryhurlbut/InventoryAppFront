import React from 'react';
import {Modal} from '@fluentui/react';
import itemController from '../../controllers/ItemController';

/*
*   Modal for adding an item
*/
export default class AddItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: props.isOpen,
            item: {},
            name: null
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.addItem = this.addItem.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async addItem() {
        let item = {
            name:               this.state.name,
            // description:        req.body.description,
            // serialNumber:       req.body.serialNumber,
            // notes:              req.body.notes,
            // homeLocation:       req.body.homeLocation,
            // specificLocation:   req.body.specificLocation,
            // available:          req.body.available,
            // servicable:         req.body.servicable,
            // isChild:            req.body.isChild
        }
        console.log(item)
        console.log(this.state)
        // await itemController.createItem(item);
    }

    render() {
        
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Add Item
                    </div>
                    <input type="text" name="Name" value={this.state.name} 
                        onChange={(event) => {this.setState({name: event.target.value})}}>
                    </input>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                    <button onClick={this.addItem}>Add Item</button>                    
                </div>
                
            </Modal>
        );
    };
};