import React from 'react';
import {Modal} from '@fluentui/react';
import itemController from '../../controllers/ItemController';

/*
*   Modal for editing an item
*/
export default class EditItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:           props.isOpen,
            name:             '',
            description:      '',
            serialNumber:     '',
            notes:            '',
            homeLocation:     '',
            specificLocation: '',
            available:        true,
            idArray:          props.idArray
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.editItem = this.editItem.bind(this);
    };

    async componentDidMount(){
        let thisItem = await itemController.getItemById(this.state.idArray[0]);

        this.setState({
            name:             thisItem.name,
            description:      thisItem.description,
            serialNumber:     thisItem.serialNumber,
            notes:            thisItem.notes,
            homeLocation:     thisItem.homeLocation,
            specificLocation: thisItem.specificLocation,
            available:        thisItem.available
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async editItem(){
        let item = {
            name:               this.state.name,
            description:        this.state.description,
            serialNumber:       this.state.serialNumber,
            notes:              this.state.notes,
            homeLocation:       this.state.homeLocation,
            specificLocation:   this.state.specificLocation,
            available:          this.state.available
        };

        await itemController.updateItem(this.state.idArray, item);
        window.location.reload();
        this.dismissModal();
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Edit Item</h3>
                </div>
                <form onSubmit={(Event) => {Event.preventDefault(); this.editItem();}}>
                    <div className='modalBody'>
                        <h4>Name</h4>
                            <input 
                            type='text' 
                            id='name' 
                            name="name" 
                            required 
                            pattern='[a-zA-Z0-9\s]{1,50}'
                            value={this.state.name} 
                            onChange={(event) => this.setState({name: event.target.value})}/>
                        <h4>Description</h4>
                            <input 
                            type='text'
                            id='description' 
                            name="description" 
                            required 
                            maxLength={50}
                            value={this.state.description} 
                            onChange={(event) => this.setState({description: event.target.value})}/>
                        <h4>Serial Number</h4>
                            <input 
                            type='text' 
                            id='serialNumber' 
                            name="serialNumber" 
                            required 
                            value={this.state.serialNumber} 
                            onChange={(event) => this.setState({serialNumber: event.target.value})}/>
                        <h4>Notes</h4>
                            <input 
                            type='text' 
                            id='notes' 
                            name="notes" 
                            value={this.state.notes} 
                            onChange={(event) => this.setState({notes: event.target.value})}/>
                        <h4>Home Location</h4>
                            <input 
                            type='text' 
                            id='homeLocation'  
                            name="homeLocation" 
                            required 
                            value={this.state.homeLocation} 
                            onChange={(event) => this.setState({homeLocation: event.target.value})}/>
                        <h4>Specific Location</h4>
                            <input 
                            type='text' 
                            id='specificLocation' 
                            name="specificLocation" 
                            required 
                            value={this.state.specificLocation} 
                            onChange={(event) => this.setState({specificLocation: event.target.value})}/>
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