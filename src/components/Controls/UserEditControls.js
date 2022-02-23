import React from 'react';
import '@fluentui/react';
// import UserController from '../controllers/UserController';
import { AddUserModal, DeleteUserModal, EditUserModal } from '..//UserModals';

/*
*   Displays the buttons for adding, deleting and editing users
*/
export default class UserEditControls extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            modal: null,
            idArray: props.idArray
        };

        this.hideModal  = this.hideModal.bind(this);
        this.addUser    = this.addUser.bind(this);
        this.editUser   = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    };

    componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props){
            this.setState({ id: this.props.id, idArray: this.props.idArray});
        };
    };
    
    addUser () {
        this.setState({modal: <AddUserModal isOpen={true} hideModal={this.hideModal}/>});
    };

    editUser () {
        this.setState({modal: <EditUserModal isOpen={true} hideModal={this.hideModal} idArray={this.state.idArray}/>});
    };

    deleteUser () {
        this.setState({modal: <DeleteUserModal isOpen={true} hideModal={this.hideModal} idArray={this.state.idArray}/>});
    };

    hideModal() {
        this.setState({modal: null});
    };

    render() {
        return(
            <div className='Edit_Controls'>
                <button onClick={this.addUser}>
                    Add User
                </button>
                <button onClick={this.editUser} disabled={this.state.idArray.length === 1 ? false : true}>
                    Edit User
                </button>
                <button onClick={this.deleteUser} disabled={this.state.idArray.length > 0 ? false : true}>
                    Delete User
                </button>
                {this.state.modal}
            </div>
        );
    };
};