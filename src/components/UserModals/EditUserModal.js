import React from 'react';
import {Modal} from '@fluentui/react';
import userController from '../../controllers/UserController';
/*
*   Modal for editing a user
*/
export default class EditUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:         props.isOpen,
            id:             props.id,
            firstName:      '',
            lastName:       '',
            userName:       '',
            password:       '',
            userRole:       '',
            phoneNumber:    '',
            error:          ''
        };

        this.dismissModal = this.dismissModal.bind(this);
    };

    async componentDidMount(){
        let thisUser = await userController.getUserById(this.state.id);

        this.setState({
            firstName:   thisUser.firstName, 
            lastName:    thisUser.lastName,
            userName:    thisUser.userName,
            password:    thisUser.password,
            userRole:    thisUser.userRole,
            phoneNumber: thisUser.phoneNumber
        });
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async editUser() {
        let user = {
            firstName:   this.state.firstName,
            lastName:    this.state.lastName,
            userName:    this.state.userName,
            password:    this.state.password,
            userRole:    this.state.userRole,
            phoneNumber: this.state.phoneNumber
        }
        await userController.updateUser(this.state.id, user)
        .then((auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({error: ''});
            window.location.reload();
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({error: err.message});
        });
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Edit User</h3>
                </div>
                <form onSubmit={(event) => {event.preventDefault(); this.editUser();}}>
                    <div className='modalBody'>
                        <h4>First Name</h4>
                            <input type='text' id='firstName' required   value={this.state.firstName} onChange={(event) => this.setState({ firstName: event.target.value })}></input>
                        <h4>Last Name</h4>
                            <input type='text' id='lastName'  required   value={this.state.lastName} onChange={(event) => this.setState({ lastName: event.target.value })}></input>
                        <h4>Username</h4>
                            <input type='text' id='userName'  required   value={this.state.userName} onChange={(event) => this.setState({ userName: event.target.value })}></input>
                        <h4>Password</h4>
                            <input type='password' id='password' required value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })}></input>
                        <h4>User's Role</h4>
                            <input type='text' id='userRole'  required   value={this.state.userRole} onChange={(event) => this.setState({ userRole: event.target.value })}></input>
                        <h4>Phone Number</h4>
                            <input type='text' id='phoneNumber' required  value={this.state.phoneNumber} onChange={(event) => this.setState({ phoneNumber: event.target.value })}></input>
                    </div>
                    <div className='modalFooter'>
                        <input type='submit' value='Submit'></input>
                        <button type="reset" onClick={this.dismissModal}>Close</button>
                    </div>
                </form>
            </Modal>
        );
    };
};