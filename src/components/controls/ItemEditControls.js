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
            selectedIds:        props.selectedIds,
            selectedObjects:    props.selectedObjects
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.setState({
                selectedIds:        this.props.selectedIds,
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
                selectedIds={this.state.selectedIds} 
                selectedObjects={this.state.selectedObjects}
            />
        });
    }

    _deleteItem = () => {
        this.setState({
            modal: <DeleteItemModal 
                isOpen
                hideModal={this.hideModal}
                selectedIds={this.state.selectedIds} 
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
                    disabled={this.state.selectedIds.length === 1 ? false : true}
                >
                    Edit Item
                </button>
                <button 
                    onClick={this._deleteItem} 
                    disabled={this.state.selectedIds.length > 0 ? false : true}
                >
                    Delete Item
                </button>
                {this.state.modal}
            </div>
        );
    }
}