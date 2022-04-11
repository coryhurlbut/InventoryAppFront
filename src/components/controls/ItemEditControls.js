import React from 'react';

import { AddItemModal, 
    EditItemModal, 
    DeleteItemModal } from '../itemModals';

/*
*   Displays the buttons for adding, deleting and editing items
*/
export default class ItemEditControls extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            modal:              null,
            idArray:            props.idArray,
            selectedObjects:    props.selectedObjects
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.setState({
                idArray:            this.props.idArray,
                selectedObjects:    this.props.selectedObjects
            });
        };
    }

    _addItem = () => {
        this.setState({
            modal: <AddItemModal 
                isOpen 
                hideModal={this.hideModal}
            />
        });
    }

    _editItem = () => {
        this.setState({
            modal: <EditItemModal 
                isOpen
                hideModal={this.hideModal}
                idArray={this.state.idArray} 
                selectedObjects={this.state.selectedObjects}
            />
        });
    }

    _deleteItem = () => {
        this.setState({
            modal: <DeleteItemModal 
                isOpen
                hideModal={this.hideModal}
                idArray={this.state.idArray} 
                selectedObjects={this.state.selectedObjects}
            />
        });
    }

    hideModal = () => {
        this.setState({ modal: null });
    }

    render() {
        return (
            <div className="Edit_Controls">
                <button onClick={this._addItem}>
                    Add Item
                </button>
                <button 
                    onClick={this._editItem} 
                    disabled={this.state.idArray.length === 1 ? false : true}
                >
                    Edit Item
                </button>
                <button 
                    onClick={this._deleteItem} 
                    disabled={this.state.idArray.length > 0 ? false : true}
                >
                    Delete Item
                </button>
                {this.state.modal}
            </div>
        );
    }
}