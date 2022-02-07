import React from 'react';
import {Checkbox, Modal} from '@fluentui/react';
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
            parents: props.parents,
            name: '',
            description: '',
            serialNumber: '',
            notes: '',
            homeLocation: '',
            specificLocation: '',
            available: true,
            servicable: true,
            isChild: false,
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
            servicable:         this.state.servicable,
            isChild:            this.state.isChild
        };

        await itemController.createItem(item);
        window.location.reload();
        this.dismissModal();
    };

    popSelect(){
        if(document.getElementById('isChild').checked){
        this.setState({ disabled: false });

        let select = document.getElementById("select-parent"),
            arr = this.state.parents.name;

        for( let i = 0; i < this.state.parents.length; i++){
            let option = document.createElement("OPTION"),
                txt = document.createTextNode(arr[i].name);
            option.appendChild(txt);
            select.insertBefore(option, select.lastChild);
        }
        }
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Add Item to database
                    </div>
                    <form name= 'test' onSubmit={(Event) => {Event.preventDefault(); this.addItem();}}>
                    <div>
                        Name
                    </div>
                        <input type='text' id='name' name="name" required value={this.state.name} onChange={(event) => this.setState({name: event.target.value})}></input>
                    <div>
                        Description
                    </div>
                        <input type='text' id='description' name="description" required value={this.state.description} onChange={(event) => this.setState({description: event.target.value})}></input>
                    <div>
                        Serial Number
                    </div>
                        <input type='text' id='serialNumber' name="serialNumber" required value={this.state.serialNumber} onChange={(event) => this.setState({serialNumber: event.target.value})}></input>
                    <div>
                        Notes
                    </div>
                        <input type='text' id='notes' name="notes" value={this.state.notes} onChange={(event) => this.setState({notes: event.target.value})}></input>
                    <div>
                        Home Location
                    </div>
                        <input type='text' id='homeLocation' name="homeLocation" required value={this.state.homeLocation} onChange={(event) => this.setState({homeLocation: event.target.value})}></input>
                    <div>
                        Specific Location
                    </div>
                        <input type='text' id='specificLocation' name="specificLocation" required value={this.state.specificLocation} onChange={(event) => this.setState({specificLocation: event.target.value})}></input>
                    <div>
                        Is Child item
                    </div>
                        <input type='checkbox' id='isChild' name="isChild" value={this.state.isChild} onClick={this.popSelect}></input>
                        <div>
                            <select name='test' id='select-parent' placeholder='Choose parent item..' disabled={this.state.disabled}>
                                <option value=''></option>
                            </select>
                        </div>
                    <div>
                        <input type='submit' value='Submit'></input>
                    </div>
                    </form>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>        
                </div>
                
            </Modal>
        );
    };
};