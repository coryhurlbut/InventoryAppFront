import React from 'react';

import { AddUserModal, 
    DeleteUserModal, 
    EditUserModal } from '../userModals';

/*
*   Displays the buttons for adding, deleting and editing users
*/
export default class UserEditControls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal:              null,
            accountRole:        props.accountRole,
            selectedIds:        props.selectedIds,
            selectedObjects:    props.selectedObjects
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.setState({ 
                accountRole:        this.props.accountRole,
                selectedIds:        this.props.selectedIds,
                selectedObjects:    this.props.selectedObjects
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

    _buildButtons = () => {
        if(this.state.accountRole === 'custodian') {
            return(
                <div className='Edit_Controls'>
                    <button onClick={this._addUser}>
                        Add User
                    </button>
                    {this.state.modal}
                </div>
            )
        } else {
            return(
                <div className="Edit_Controls">
                    <button onClick={this._addUser}>
                        Add User
                    </button>
                    <button 
                        onClick={this._editUser} 
                        disabled={this.state.selectedIds.length === 1 ? false : true}
                    >
                        Edit User
                    </button>
                    <button 
                        onClick={this._deleteUser} 
                        disabled={this.state.selectedIds.length > 0 ? false : true}
                    >
                        Delete User
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