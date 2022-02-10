import React from 'react';
import {Modal} from '@fluentui/react';
import {loginLogoutController} from '../../controllers/LoginLogoutController';

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
            if(auth.ok !== undefined && auth.ok === false) throw auth;
            this.setState({error: ''});
            this.props.setAuth(auth);
            this.dismissModal();
        })
        .catch(async (err) => {
            let errorData
            await err.json().then((data) => {
                errorData = data;
            });
            
            this.setState({error: errorData.error.message});
        })
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Log In</h3>
                </div>
                {this.state.error || null}
                <div className='modalBody'>
                    <div id='modalBody_Username'>
                        <h4>Username: </h4>
                        <input type='text' key='userName' value={this.state.userName} onChange={(event) => {this.setState({userName: event.target.value})}}></input>
                    </div>
                    <div id='modalBody_Password'>
                        <h4>Password: </h4>
                        <input type='password' key='password' value={this.state.password} onChange={(event) => {this.setState({password: event.target.value})}}></input>
                    </div>
                </div>
                <div className='modalFooter'>
                    <button onClick={this.login}>Log in</button>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
            </Modal>
        );
    };
};