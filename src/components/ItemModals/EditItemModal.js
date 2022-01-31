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
            isChild: false
            
        };

        this.dismissModal = this.dismissModal.bind(this);
    };

    async componentDidMount(){
        let thisItem = await itemController.getItemById(this.state.id);

        this.setState({name:             thisItem.name});
        this.setState({description:      thisItem.description});
        this.setState({serialNumber:     thisItem.serialNumber});
        this.setState({notes:            thisItem.notes});
        this.setState({homeLocation:     thisItem.homeLocation});
        this.setState({specificLocation: thisItem.specificLocation});
        this.setState({available:        thisItem.available});
        this.setState({servicable:       thisItem.servicable});
        this.setState({isChild:          thisItem.isChild});
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
            available:          this.state.available,
            servicable:         this.state.servicable,
            isChild:            this.state.isChild
        };

        await itemController.updateItem(this.state.id, item);
        window.location.reload(false);
        this.dismissModal();
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Edit Item
                    </div>
                    <div>Name</div>
                        <input type='text' id='name' name="name" value={this.state.name} onChange={(event) => this.setState({name: event.target.value})}></input>
                    <div>Description</div>
                        <input type='text' id='description' name="description" value={this.state.description} onChange={(event) => this.setState({description: event.target.value})}></input>
                    <div>Serial Number</div>
                        <input type='text' id='serialNumber' name="serialNumber" value={this.state.serialNumber} onChange={(event) => this.setState({serialNumber: event.target.value})}></input>
                    <div>Notes</div>
                        <input type='text' id='notes' name="notes" value={this.state.notes} onChange={(event) => this.setState({notes: event.target.value})}></input>
                    <div>Home Location</div>
                        <input type='text' id='homeLocation' name="homeLocation" value={this.state.homeLocation} onChange={(event) => this.setState({homeLocation: event.target.value})}></input>
                    <div>Specific Location</div>
                        <input type='text' id='specificLocation' name="specificLocation" value={this.state.specificLocation} onChange={(event) => this.setState({specificLocation: event.target.value})}></input>
                    <div>Is Child item</div>
                        <input type='checkbox' id='isChild' name="isChild" value={this.state.isChild} onChange={(event) => this.setState({isChild: event.target.value})}></input>
                    <div>
                        <button onClick={() => {this.editItem()}}>Submit</button>
                    </div>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    };
};