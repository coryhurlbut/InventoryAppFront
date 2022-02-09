import React from 'react';
import {Modal} from '@fluentui/react';
import {loginLogoutController} from '../controllers/LoginLogoutController';

/*
*   Modal for logging in
*/
export default class LoginModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpen:     props.isOpen,
            userName:   '',
            password:   '',
            error:      ''
        };

        this.login          = this.login.bind(this);
        this.dismissModal   = this.dismissModal.bind(this);
    };

    async login() {
        await loginLogoutController.login(this.state.userName, this.state.password)
        .then((auth) => {
            if(auth.status >= 400) throw auth;
            this.setState({error: ''});
            this.props.setAuth(auth);
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({error: err.message});
        })
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='header'>
                    Log In
                </div>
                {this.state.error || null}
                <div>
                    <div>Username: </div>
                    <input type='text' key='userName' value={this.state.userName} onChange={(event) => {this.setState({userName: event.target.value})}}></input>
                </div>
                <div>
                    <div>Password: </div>
                    <input type='password' key='password' value={this.state.password} onChange={(event) => {this.setState({password: event.target.value})}}></input>
                </div>
                <button onClick={this.login}>Log in</button>
                <button onClick={this.dismissModal}>Close</button>
            </Modal>
        );
    };
};