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
                <div className='modalHeader'>
                    Log In
                </div>
                <form onSubmit={(event) => {event.preventDefault(); this.login();}}>
                    {this.state.error}
                    <div className='modalBody'>
                        <div id='modalBody_Username'>
                            <div>Username: </div>
                            <input type='text' key='userName' required value={this.state.userName} onChange={(event) => {this.setState({userName: event.target.value})}}></input>
                        </div>
                        <div id='modalBody_Password'>
                            <div>Password: </div>
                            <input type='password' key='password' required value={this.state.password} onChange={(event) => {this.setState({password: event.target.value})}}></input>
                        </div>
                    </div>
                    <div className='modalFooter'>
                        <button type="submit" onClick={this.login}>Log in</button>
                        <button type="reset" onClick={this.dismissModal}>Close</button>
                    </div>
                </form>
            </Modal>
        );
    };
};