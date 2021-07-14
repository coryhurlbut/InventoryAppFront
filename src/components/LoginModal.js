import React from 'react';
import {Modal} from '@fluentui/react';
import AuthController from '../controllers/AuthController';

/*
*   Modal for logging in
*/
export default class LoginModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpen:     props.isOpen,
            userName:   null,
            password:   null,
        };

        this.login          = this.login.bind(this);
        this.dismissModal   = this.dismissModal.bind(this);

    };

    async login() {
        await AuthController.login(this.state.userName, this.state.password)
            .then((auth) => {
                this.props.setAuth(auth)
            }
        );
        this.dismissModal();
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Log In
                    </div>
                    <div>
                        <div>Username: </div>
                        <input type='text' key='userName' onChange={(event) => {this.setState({userName: event.target.value})}}></input>
                    </div>
                    <div>
                        <div>Password: </div>
                        <input type='text' key='password' onChange={(event) => {this.setState({password: event.target.value})}}></input>
                    </div>
                    <button onClick={this.login}>Log in</button>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
            </Modal>
        );
    };
};