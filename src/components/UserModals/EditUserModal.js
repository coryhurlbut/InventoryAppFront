import React from 'react';
import {Modal} from '@fluentui/react';
import userController from '../../controllers/UserController';
import adminLogController from '../../controllers/AdminLogController';
/*
*   Modal for editing a user
*/
export default class EditUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:         props.isOpen,
            idArray:        props.idArray,
            firstName:      '',
            lastName:       '',
            userName:       '',
            password:       '',
            userRole:       '',
            phoneNumber:    '',
            error:          '',
            isError:        false,
            pwDisabled:     true,
            pwRequired:     false,
            hasPassword:    false,
            resetBtn:       false,
        };
    };

    async componentDidMount(){
        let thisUser = await userController.getUserById(this.state.idArray[0]);

        //Sets the userRole select tag to the user's role
        let select = document.getElementById('selectUser');
        select.value = thisUser.userRole;

        /* Will set password reset button to show and track that 
            the user has a password already if they were originally
            a custodian or admin.*/
        if (thisUser.userRole !== 'user') {
            this.setState({ resetBtn: true, hasPassword: true });
        };

        this.setState({
            firstName:   thisUser.firstName, 
            lastName:    thisUser.lastName,
            userName:    thisUser.userName,
            userRole:    thisUser.userRole,
            phoneNumber: thisUser.phoneNumber
        });
    };

    dismissModal() {
        this.setState({ isOpen: false });
    };

    async editUser() {
        let user = {
            firstName:   this.state.firstName,
            lastName:    this.state.lastName,
            userName:    this.state.userName,
            password:    this.state.password,
            userRole:    this.state.userRole,
            phoneNumber: this.state.phoneNumber,
            hasPassword: this.state.hasPassword
        };
        let log = {
            itemId:     'N/A',
            userId:     this.state.idArray[0],
            adminId:    '',
            action:     'edit',
            content:    'user'
        };
        await userController.updateUser(this.state.idArray[0], user)
        .then(async(auth) => {
            if ( auth.status !== undefined && auth.status >= 400 ) throw auth;
            this.setState({ error: '', isError: false });
            await adminLogController.createAdminLog(log);
            window.location.reload();
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ error: err.message, isError : true });
        });
    };

    handleUserRoleChange(event) {
        if (event.target.value === 'user') {
            this.setState({ 
                password: '', 
                userRole: event.target.value, 
                pwRequired: false, 
                pwDisabled: true, 
                resetBtn: false 
            });
        } else if (event.target.value !== 'user' && !this.state.hasPassword){
            this.setState({ 
                password: '', 
                userRole: event.target.value, 
                pwRequired: true, 
                pwDisabled: false, 
                resetBtn: false 
            });
        } else {
            this.setState({
                password: '', 
                userRole: event.target.value, 
                pwRequired: false, 
                pwDisabled: true, 
                resetBtn: true 
            });
        };
    }

    allowPasswordReset() {
        this.setState({
            pwDisabled: false, 
            pwRequired: true, 
            resetBtn: false
        });
    }

    buildForm(){
        return(
            <>
            <form onSubmit={(event) => {event.preventDefault(); this.editUser();}}>
                <div className='modalBody'>
                    {this.state.isError ? <label className='errorMessage'>{this.state.error}</label> : null}
                    <h4>First Name</h4>
                        <input 
                        type='text' 
                        id='firstName' 
                        required   
                        pattern='[a-zA-Z\s]{1,25}'
                        value={this.state.firstName} 
                        onChange={(event) => this.setState({ firstName: event.target.value })}/>
                    <h4>Last Name</h4>
                        <input 
                        type='text' 
                        id='lastName'  
                        required   
                        pattern='[a-zA-Z\s]{1,25}'
                        value={this.state.lastName} 
                        onChange={(event) => this.setState({ lastName: event.target.value })}/>
                    <h4>Username</h4>
                        <input 
                        type='text' 
                        id='userName'  
                        readOnly
                        value={this.state.userName}/>
                    <h4>User's Role</h4>
                        <select id='selectUser' required  onChange={(event) => this.handleUserRoleChange(event)}>
                            <option id="userOpt" value='user'>User</option>
                            <option id="custodianOpt" value='custodian'>Custodian</option>
                            <option id="adminOpt" value='admin'>Admin</option>
                        </select>
                    <h4>Password</h4>
                        <input 
                        type='password' 
                        id='password' 
                        disabled={this.state.pwDisabled}
                        required={this.state.pwRequired}
                        pattern='[a-zA-Z0-9]{6,25}'
                        value={this.state.password} 
                        onChange={(event) => this.setState({ password: event.target.value })}/>
                        <span>  </span>
                        <button hidden={!this.state.resetBtn} onClick={() => this.allowPasswordReset()}>Reset</button>
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
                    <input type='submit' value='Submit'></input>
                    <button type="reset" onClick={() => {this.dismissModal()}}>Close</button>
                </div>
            </form>
            </>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Edit User</h3>
                </div>
                {this.buildForm()}
            </Modal>
        );
    };
};