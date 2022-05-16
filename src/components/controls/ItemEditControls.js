import React from 'react';

import { AddItemModal, 
    EditItemModal, 
    DeleteItemModal } from '../itemModals';

/*
*   Displays the buttons for adding, deleting and editing items
*/
const BTN_ADD_ITEM_TXT = 'Add Item';
const BTN_EDIT_ITEM_TXT = 'Edit Item';
const BTN_DELETE_ITEM_TXT = 'Delete Item';
export default class ItemEditControls extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            modal           : null,
            selectedIds     : props.selectedIds,
            selectedObjects : props.selectedObjects,
            accountRole     : props.accountRole
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.setState({
                selectedIds     : this.props.selectedIds,
                selectedObjects : this.props.selectedObjects
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
                accountRole={this.state.accountRole}
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

    _disableButton = (btnSelected) => {
        try {
            if(this.state.selectedIds.length){
                if(btnSelected === 'Edit') {
                    return !(this.state.selectedIds.length === 1);
                } else {
                    return !(this.state.selectedIds.length > 0);
                }
            } else {
                return true;
            }
            
        } catch (error) {
            alert("An error has occured. Contact Admin.");
        }
    }

    render() {
        return (
            <div className="Edit_Controls">
<<<<<<< HEAD
                <button onClick={this._addItem}>
                    {BTN_ADD_ITEM_TXT}
                </button>
=======
                {this.state.accountRole === 'admin' ? <button onClick={this._addItem}>
                    Add Item
                </button> : null}
>>>>>>> 63c59b077a8c8d9a97d17d6b088054ca5e41a350
                <button 
                    onClick={this._editItem} 
                    disabled={this._disableButton("Edit")}
                >
                    {BTN_EDIT_ITEM_TXT}
                </button>
                {this.state.accountRole === 'admin' ? <button 
                    onClick={this._deleteItem} 
                    disabled={this._disableButton("Delete")}
                >
<<<<<<< HEAD
                    {BTN_DELETE_ITEM_TXT}
                </button>
=======
                    Delete Item
                </button> : null}
>>>>>>> 63c59b077a8c8d9a97d17d6b088054ca5e41a350
                {this.state.modal}
            </div>
        );
    }
}