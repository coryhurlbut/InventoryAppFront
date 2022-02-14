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
            id: props.id,
            name: '',
            description: '',
            serialNumber: '',
            notes: '',
            homeLocation: '',
            specificLocation: '',
            available: true,
            servicable: true,
            disabled: true
        };
        this.dismissModal = this.dismissModal.bind(this);
        this.addItem = this.addItem.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async addItem() {
        //add to database called upon submit
        let item = {
            name:               this.state.name,
            description:        this.state.description,
            serialNumber:       this.state.serialNumber,
            notes:              this.state.notes,
            homeLocation:       this.state.homeLocation,
            specificLocation:   this.state.specificLocation,
            available:          this.state.available,
            servicable:         this.state.servicable
        };

        await itemController.createItem(item);
        window.location.reload();
        this.dismissModal();
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Add Item to database</h3>
                </div>
                <form name= 'test' onSubmit={(Event) => {Event.preventDefault(); this.addItem();}}>
                    <div className='modalBody'>
                        <h4>Name</h4>
                            <input type='text' id='name' name="name" required value={this.state.name} onChange={(event) => this.setState({name: event.target.value})}></input>
                        <h4>Description</h4>
                            <input type='text' id='description' name="description" required value={this.state.description} onChange={(event) => this.setState({description: event.target.value})}></input>
                        <h4>Serial Number</h4>
                            <input type='text' id='serialNumber' name="serialNumber" required value={this.state.serialNumber} onChange={(event) => this.setState({serialNumber: event.target.value})}></input>
                        <h4>Notes</h4>
                            <input type='text' id='notes' name="notes" value={this.state.notes} onChange={(event) => this.setState({notes: event.target.value})}></input>
                        <h4>Home Location</h4>
                            <input type='text' id='homeLocation' name="homeLocation" required value={this.state.homeLocation} onChange={(event) => this.setState({homeLocation: event.target.value})}></input>
                        <h4>Specific Location</h4>
                            <input type='text' id='specificLocation' name="specificLocation" required value={this.state.specificLocation} onChange={(event) => this.setState({specificLocation: event.target.value})}></input>
<<<<<<< HEAD
=======
                        
>>>>>>> 63845ad076d6979959c04783f646cfcf5e6469c6
                    </div>
                    <div className='modalFooter'>
                        <input type='submit' value='Submit'></input>
                        <button type="reset" onClick={this.dismissModal}>Close</button>
                    </div> 
                </form>
            </Modal>
        );
    };
};