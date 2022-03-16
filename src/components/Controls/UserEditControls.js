import React from 'react';
import '@fluentui/react';
import { AddUserModal, DeleteUserModal, EditUserModal } from '..//UserModals';

/*
*   Displays the buttons for adding, deleting and editing users
*/
export default class UserEditControls extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            modal: null,
            idArray: props.idArray,
            selectedObjects: props.selectedObjects,
            role: props.role
        };

        this.hideModal  = this.hideModal.bind(this);
    };

    componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props){
            this.setState({ 
                role: this.props.role, 
                idArray: this.props.idArray, 
                selectedObjects: this.props.selectedObjects
            });
        };
    };
    
    addUser () {
        this.setState({
            modal: <AddUserModal 
                isOpen={true} 
                hideModal={this.hideModal}
                />
        });
    };

    editUser () {
        this.setState({
            modal: <EditUserModal 
                isOpen={true} 
                hideModal={this.hideModal} 
                idArray={this.state.idArray} 
                selectedObjects={this.state.selectedObjects} 
            />
        });
    };

    deleteUser () {
        this.setState({
            modal: <DeleteUserModal 
                isOpen={true} 
                hideModal={this.hideModal} 
                idArray={this.state.idArray} 
                selectedObjects={this.state.selectedObjects} 
            />
        });
    };

    hideModal() {
        this.setState({ modal: null });
    };

    buildButtons() {
        if(this.state.role === 'custodian'){
            return(
            <div className='Edit_Controls'>
                <button onClick={() => this.addUser()}>
                    Add User
                </button>
                {this.state.modal}
            </div>
            )
        }else{
            return(
            <div className='Edit_Controls'>
                <button onClick={() => this.addUser()}>
                    Add User
                </button>
                <button onClick={() => this.editUser()} disabled={this.state.idArray.length === 1 ? false : true}>
                    Edit User
                </button>
                <button onClick={() => this.deleteUser()} disabled={this.state.idArray.length > 0 ? false : true}>
                    Delete User
                </button>
                {this.state.modal}
            </div>
        );}
    }

    render() {
        return(this.buildButtons());
    };
};