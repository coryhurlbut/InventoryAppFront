import React from 'react';
import {Modal} from '@fluentui/react';
import UserController from '../../controllers/UserController';
import '../../styles/Modal.css';

/*
*   Modal for adding a user
*/
export default class AddUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: props.isOpen,
            user: null,
            firstName: '',
            lastName: '',
            userName: '',
            password: '',
            userRole: '',
            phoneNumber: ''
        };
        this.dismissModal = this.dismissModal.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async addUser(){
        let user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            userName: this.state.userName,
            password: this.state.password,
            userRole: this.state.userRole,
            phoneNumber: this.state.phoneNumber
        }
        await UserController.createUser(user);
        window.location.reload();
        this.dismissModal();
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    Add User to Database
                </div>
                <form onSubmit={(Event) => {Event.preventDefault(); this.addUser();}}>
                    <div className='modalBody'>
                        <div>
                            First Name
                        </div>
                            <input type='text' id='firstName'  required  value={this.state.firstName} onChange={(event) => this.setState({ firstName: event.target.value })}></input>
                        <div>
                            Last Name
                        </div>
                            <input type='text' id='lastName'  required   value={this.state.lastName} onChange={(event) => this.setState({ lastName: event.target.value })}></input>
                        <div>
                            Username
                        </div>
                            <input type='text' id='userName'  required minLength={6}   value={this.state.userName} onChange={(event) => this.setState({ userName: event.target.value })}></input>
                        <div>
                            Password
                        </div>
                            <input type='password' id='password' required minLength={6} value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })}></input>
                        <div>
                            User's Role
                        </div>
                            <input type='text' id='userRole' required     value={this.state.userRole} onChange={(event) => this.setState({ userRole: event.target.value })}></input>
                        <div>
                            Phone Number
                        </div>
                        <input type='text' id='phoneNumber' required minLength={10} maxLength={10} value={this.state.phoneNumber} onChange={(event) => this.setState({ phoneNumber: event.target.value })}></input>
                    </div>
                    <div className='modalFooter'>
                        <input type='submit' value='Submit'></input>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                </form>
            </Modal>
        );
    };
};