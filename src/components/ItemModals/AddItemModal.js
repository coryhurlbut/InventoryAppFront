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
            item: null,
            name: null,
            description: null,
            serialNumber: null,
            notes: null,
            homeLocation: null,
            specificLocation: null,
            available: true,
            servicable: true,
            isChild: false,
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.addItem = this.addItem.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async addItem() {
        console.log(this.state);
        
        //add to database called upon submit
        let item = {
            name:               this.state.name,
            description:        this.state.description,
            serialNumber:       this.state.serialNumber,
            notes:              this.state.notes,
            homeLocation:       this.state.homeLocation,
            specificLocation:   this.state.specificLocation,
            available:          this.state.available,
            servicable:         this.state.servicable,
            isChild:            this.state.isChild
        }
        let response = await itemController.createItem(item);
        console.log(response);
        this.dismissModal();
    }

    render() {
        
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Add Item to database
                    </div>
                    <div>Name</div>
                        <input type='text' id='name' name="name" value={this.state.name} onChange={(event) => this.setState({name: event.target.value})}>
                    </input>
                    <div>Description</div>
                        <input type='text' id='description' name="description" value={this.state.description} onChange={(event) => this.setState({description: event.target.value})}>
                    </input>
                    <div>Serial Number</div>
                        <input type='text' id='serialNumber' name="serialNumber" value={this.state.serialNumber} onChange={(event) => this.setState({serialNumber: event.target.value})}>
                    </input>
                    <div>Notes</div>
                        <input type='text' id='notes' name="notes" value={this.state.notes} onChange={(event) => this.setState({notes: event.target.value})}></input>
                    <div>Location</div>
                        <input type='text' id='homeLocation' name="homeLocation" value={this.state.homeLocation} onChange={(event) => this.setState({homeLocation: event.target.value})}>
                    </input>
                    <div>Is Child item</div>
                    <input type='checkbox' id='isChild' name="isChild" value={this.state.isChild} onChange={(event) => this.setState({isChild: event.target.value})}>
                    </input>
                    <div>
                    <button onClick={() => {this.addItem()}}>Submit</button>
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