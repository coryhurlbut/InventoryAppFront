import React from 'react';
import '@fluentui/react';
// import UserController from '../controllers/UserController';
import { AddUserModal, DeleteUserModal, EditUserModal } from './UserModals';

/*
*   Displays the buttons for adding, deleting and editing users
*/
export default class UserEditControls extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user: null
        };

        this.hideModal  = this.hideModal.bind(this);
        this.addUser    = this.addUser.bind(this);
        this.editUser   = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    };
    
    addUser () {
        this.setState({modal: <AddUserModal isOpen={true} hideModal={this.hideModal}/>});
    };

    editUser () {
        this.setState({modal: <EditUserModal isOpen={true} hideModal={this.hideModal}/>});
    };

    deleteUser () {
        this.setState({modal: <DeleteUserModal isOpen={true} hideModal={this.hideModal}/>});
    };

    hideModal() {
        this.setState({modal: null});
    };

    render() {
        return(
            <div>
                <button onClick={this.addUser}>
                    Add User
                </button>
                <button onClick={this.editUser}>
                    Edit User
                </button>
                <button onClick={this.deleteUser}>
                    Delete User
                </button>
                {this.state.modal}
            </div>
        );
    };
};