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
            isError:    false,
            error:      ''
        };

        this.login          = this.login.bind(this);
        this.dismissModal   = this.dismissModal.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async login() {
        await loginLogoutController.login(this.state.userName, this.state.password)
        .then((auth) => {
            if(auth.status >= 400) throw auth;
            this.setState({error: ''});
            this.setState({isError: false});
            this.props.setAuth(auth);
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({error: err.message});
            this.setState({isError: true});
        })
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Log In</h3>
                </div>
                <form onSubmit={(event) => {event.preventDefault(); this.login();}}>
                    <div className='modalBody'>
                        <div id='modalBody_Username'>
                            <h4>Username: </h4>
                            <input 
                            type='text' 
                            key='userName' 
                            required 
                            value={this.state.userName} 
                            onChange={(event) => {this.setState({userName: event.target.value})}}/>
                            {this.state.isError ? <label className='errorMessage'>{this.state.error === 'Username is incorrect' ? this.state.error : null}</label> : null}
                        </div>
                        <div id='modalBody_Password'>
                            <h4>Password: </h4>
                            <input 
                            type='password' 
                            key='password' 
                            required
                            value={this.state.password} 
                            onChange={(event) => {this.setState({password: event.target.value})}}/>
                            {this.state.isError ? <label className='errorMessage'>{this.state.error === 'Password is incorrect' ? this.state.error : null}</label> : null}
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