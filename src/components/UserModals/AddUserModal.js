import React from 'react';
import {Modal, values} from '@fluentui/react';
import UserController from '../../controllers/UserController';

/*
*   Modal for adding a user
*/
export default class AddUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:         props.isOpen,
            firstName:      "",
            lastName:       "",
            userName:       "",
            password:       "",
            userRole:       "",
            phoneNumber:    "",
            error:         "",
            isError:        false
        };
        this.dismissModal = this.dismissModal.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async addUser(){
        let user = {
            firstName:      this.state.firstName,
            lastName:       this.state.lastName,
            userName:       this.state.userName,
            password:       this.state.password,
            userRole:       this.state.userRole,
            phoneNumber:    this.state.phoneNumber
        }
        await UserController.createUser(user)
        .then((auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({error: ''});
            this.setState({ isError: false });
            window.location.reload();
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({error: err.message});
            this.setState({ isError: true });
        });
    };

    buildForm(){
        return(
            <>
                <form onSubmit={(Event) => {Event.preventDefault(); this.addUser();}}>
                    <div className='modalBody'>
                        <h4>First Name</h4>
                            <input 
                            type='text' 
                            id='firstName' 
                            required 
                            pattern='[a-zA-Z]{1,25}'
                            value={this.state.firstName} 
                            onChange={(event) => this.setState({ firstName: event.target.value })}/>
                        <h4>Last Name</h4>
                            <input 
                            type='text' 
                            id='lastName' 
                            required 
                            pattern='[a-zA-Z]{1,25}'
                            value={this.state.lastName} 
                            onChange={(event) => this.setState({ lastName: event.target.value })}/>
                        <h4>Username</h4>
                            <input 
                            type='text' 
                            id='userName' 
                            required
                            pattern='[a-zA-Z0-9]{6,25}'
                            value={this.state.userName} 
                            onChange={(event) => this.setState({ userName: event.target.value })}/>
                        <h4>Password</h4>
                            <input
                            type='password'
                            id='password' 
                            required 
                            pattern='[a-zA-Z0-9]{6,25}'
                            value={this.state.password} 
                            onChange={(event) => this.setState({ password: event.target.value })}/>
                        <h4>User's Role</h4>
                            <select id='selectUser' required onChange={(event) => this.setState({ userRole: event.target.value })}>
                                <option label='' hidden disabled selected></option>
                                <option value='user'>User</option>
                                <option value='custodian'>Custodian</option>
                                <option value='admin'>Admin</option>
                            </select>
                        <h4>Phone Number</h4>
                            <input
                            type='text' 
                            id='phoneNumber' 
                            required 
                            pattern='[0-9]{10}'
                            value={this.state.phoneNumber} 
                            onChange={(event) => this.setState({ phoneNumber: event.target.value })}/>
                    </div>
                    <div className='modalFooter'>
                        <input type='submit' value='Submit'/>
                        <button type="reset" onClick={this.dismissModal}>Close</button>
                    </div>
                </form>
            </>
        );
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Add User to Database</h3>
                </div>
                {this.state.isError ? <label>{this.state.error}</label> : this.buildForm()}
            </Modal>
        );
    };
};