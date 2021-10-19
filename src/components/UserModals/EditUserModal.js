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
            isOpen: props.isOpen,
            id: props.id,
            firstName: null,
            lastName: null,
            userName: null,
            password: null,
            userRole: null,
            phoneNumber: null
        };

        this.dismissModal = this.dismissModal.bind(this);
    };

    async componentDidMount(){
        let thisUser = await userController.getUserById(this.state.id);

        this.setState({firstName:   thisUser.firstName});
        this.setState({lastName:    thisUser.lastName});
        this.setState({userName:    thisUser.userName});
        this.setState({password:    thisUser.password});
        this.setState({userRole:    thisUser.userRole});
        this.setState({phoneNumber: thisUser.phoneNumber});
    }

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
        let respone = await userController.updateUser(this.state.id, user);
        this.dismissModal();
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Add User to Database
                    </div>
                    <div>
                        First Name
                    </div>
                        <input type='text' id='firstName'    value={this.state.firstName} onChange={(event) => this.setState({ firstName: event.target.value })}></input>
                    <div>
                        Last Name
                    </div>
                        <input type='text' id='lastName'     value={this.state.lastName} onChange={(event) => this.setState({ lastName: event.target.value })}></input>
                    <div>
                        Username
                    </div>
                        <input type='text' id='userName'     value={this.state.userName} onChange={(event) => this.setState({ userName: event.target.value })}></input>
                    <div>
                        Password
                    </div>
                        <input type='password' id='password' value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })}></input>
                    <div>
                        User's Role
                    </div>
                        <input type='text' id='userRole'     value={this.state.userRole} onChange={(event) => this.setState({ userRole: event.target.value })}></input>
                    <div>
                        Phone Number
                    </div>
                        <input type='text' id='phoneNumber'  value={this.state.phoneNumber} onChange={(event) => this.setState({ phoneNumber: event.target.value })}></input>
                    <div>
                        <button onClick={() => {this.editUser()}}>Submit</button>
                    </div>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    };
};