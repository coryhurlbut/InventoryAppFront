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
            accountRole     : props.accountRole,
        };
    }

    //accepts passed props and assigns them to local state variables
    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.setState({
                selectedIds     : this.props.selectedIds,
                selectedObjects : this.props.selectedObjects,
                accountRole     : this.props.accountRole
            });
        };
    }
    
    /**
     * A function for each button present, which then calls the associated modal
     */

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

    //we set modal to null to avoid soft crashing the page
    hideModal = () => {
        this.setState({ modal: null });
    }
    
    /**
     * render which displays the actual buttons and also relies on turnary operators to configure proper button availability based on selected items
     */
    render() {
        return (
            <div className="Edit_Controls">
                <button 
                    onClick={this._addItem}
                    hidden={this.state.accountRole === 'custodian'}
                >
                    {BTN_ADD_ITEM_TXT}
                </button>
                <button 
                    onClick={this._editItem} 
                    disabled={this.state.selectedIds === undefined || this.state.selectedIds.length !== 1}
                >
                    {BTN_EDIT_ITEM_TXT}
                </button>
                <button 
                    onClick={this._deleteItem} 
                    disabled={this.state.selectedIds === undefined || this.state.selectedIds.length === 0}
                    hidden={this.state.accountRole === 'custodian'}
                >
                    {BTN_DELETE_ITEM_TXT}
                </button>
                {this.state.modal}
            </div>
        );
    }
}