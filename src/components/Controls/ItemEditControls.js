import React from 'react';
import '@fluentui/react';
import { AddItemModal, EditItemModal, DeleteItemModal } from '../ItemModals';

/*
*   Displays the buttons for adding, deleting and editing items
*/
export default class ItemEditControls extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            modal: null,
            idArray: props.idArray,
            selectedObjects: props.selectedObjects
        };
    };

    componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props){
            this.setState({ idArray: this.props.idArray });
        }
    };

    addItem () {
        this.setState({
            modal: <AddItemModal 
                isOpen={true} 
                hideModal={() => this.hideModal()}
            />
        });
    };

    editItem () {
        this.setState({
            modal: <EditItemModal 
                isOpen={true} 
                idArray={this.state.idArray} 
                hideModal={() => this.hideModal()}
                selectedObjects={this.state.selectedObjects}
            />
        });
    };

    deleteItem () {
        this.setState({
            modal: <DeleteItemModal 
                isOpen={true} 
                idArray={this.state.idArray} 
                hideModal={() => this.hideModal()}
                selectedObjects={this.state.selectedObjects}
            />
        });
    };

    hideModal() {
        this.setState({ modal: null });
    };

    render() {
        return (
            <div className='Edit_Controls'>
                <button onClick={() => this.addItem()}>
                    Add Item
                </button>
                <button onClick={() => this.editItem()} disabled={this.state.idArray.length === 1 ? false : true}>
                    Edit Item
                </button>
                <button onClick={() => this.deleteItem()} disabled={this.state.idArray.length > 0 ? false : true}>
                    Delete Item
                </button>
                {this.state.modal}
            </div>
        );
    };
};