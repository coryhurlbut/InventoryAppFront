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
            role:                props.role,
            idArray:            props.idArray,
            selectedObjects:    props.selectedObjects
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.setState({ 
                role:               this.props.role,
                idArray:            this.props.idArray,
                selectedObjects:    this.props.selectedObjects
            });
        };
    }
    
    _addUser = () => {
        this.setState({
            modal: <AddUserModal 
                isOpen
                hideModal={this.hideModal}
            />
        });
    }

    _editUser = () => {
        this.setState({
            modal: <EditUserModal 
                isOpen
                hideModal={this.hideModal} 
                idArray={this.state.idArray} 
                selectedObjects={this.state.selectedObjects} 
            />
        });
    }

    _deleteUser = () => {
        this.setState({
            modal: <DeleteUserModal 
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

    _buildButtons = () => {
        if(this.state.role === 'custodian') {
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
                        disabled={this.state.idArray.length === 1 ? false : true}
                    >
                        Edit User
                    </button>
                    <button 
                        onClick={this._deleteUser} 
                        disabled={this.state.idArray.length > 0 ? false : true}
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