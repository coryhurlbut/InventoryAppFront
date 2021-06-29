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
            isOpen: true,
            userName: null,
            password: null,
            auth: null
        };

        this.login = this.login.bind(this);
    };

    async login() {
        await AuthController.login(this.state.userName, this.state.password).then((auth) => this.setState({auth: auth}));
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen}>
                <div>
                    <div className='header'>
                        Log In
                    </div>
                    <div style={{display: 'inline' }}>
                        <div>Username: </div>
                        <input type='text' key='userName' onChange={(event) => {this.setState({userName: event.target.value})}}></input>
                    </div>
                    <div style={{display: 'inline' }}>
                        <div>Password: </div>
                        <input type='text' key='password' onChange={(event) => {this.setState({password: event.target.value})}}></input>
                    </div>
                    <button onClick={this.login}>Log in</button>
                </div>
            </Modal>
        );
    };
};