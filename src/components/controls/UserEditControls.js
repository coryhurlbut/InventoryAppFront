import React from 'react';

import { AddUserModal, 
    DeleteUserModal, 
    EditUserModal } from '../userModals';

/*
*   Displays the buttons for adding, deleting and editing users
*/
const BTN_ADD_USER_TXT = 'Add User';
const BTN_EDIT_USER_TXT = 'Edit User';
const BTN_DELETE_USER_TXT = 'Delete User';

export default class UserEditControls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal           : null,
            accountRole     : props.accountRole,
            selectedIds     : props.selectedIds,
            selectedObjects : props.selectedObjects
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.setState({ 
                accountRole     : this.props.accountRole,
                selectedIds     : this.props.selectedIds,
                selectedObjects : this.props.selectedObjects
            });
        };
    }
    
    _addUser = () => {
        this.setState({
            modal: <AddUserModal 
                isOpen
                userRole={null}
                hideModal={this.hideModal}
            />
        });
    }

    _editUser = () => {
        this.setState({
            modal: <EditUserModal 
                isOpen
                hideModal={this.hideModal} 
                selectedIds={this.state.selectedIds} 
                selectedObjects={this.state.selectedObjects} 
            />
        });
    }

    _deleteUser = () => {
        this.setState({
            modal: <DeleteUserModal 
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

    _buildButtons = () => {
        if(this.state.accountRole === 'custodian') {
            return(
                <div className='Edit_Controls'>
                    <button onClick={this._addUser}>
                        {BTN_ADD_USER_TXT}
                    </button>
                    {this.state.modal}
                </div>
            )
        } else {
            return(
                <div className="Edit_Controls">
                    <button onClick={this._addUser}>
                        {BTN_ADD_USER_TXT}
                    </button>
                    <button 
                        onClick={this._editUser} 
                        disabled={this._disableButton('Edit')}
                    >
                        {BTN_EDIT_USER_TXT}
                    </button>
                    <button 
                        onClick={this._deleteUser} 
                        disabled={this._disableButton('Delete')}
                    >
                        {BTN_DELETE_USER_TXT}
                    </button>
                    {this.state.modal}
                </div>
            );
        };
    }

    render() {
        return this._buildButtons();
    }
}