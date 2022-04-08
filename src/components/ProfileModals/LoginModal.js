import React from 'react';
import {Modal} from '@fluentui/react';
import {loginLogoutController} from '../../controllers/LoginLogoutController';
import { AddUserModal } from '../userModals';

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
            error:      '',
            isSignUp:   null
        };

        this.login          = this.login.bind(this);
        this.isSigningUp    = this.isSigningUp.bind(this);
        this.dismissModal   = this.dismissModal.bind(this);
        this.hideModal      = this.hideModal.bind(this);
        
    };

    hideModal() {
        this.setState({ modal: null });
    };
    
    dismissModal() {
        this.setState({isOpen: false});
    };

    async login() {
        await loginLogoutController.login(this.state.userName, this.state.password)
        .then((auth) => {
            if(auth.status >= 400) throw auth;
            this.setState({error: '', isError: false});
            this.props.setAuth(auth);
            this.dismissModal();
        })
        .catch(async (err) => {    
            this.setState({error: err.message, isError: true});
        })
    };
    isSigningUp(){
        this.setState({ isSignUp: true });
    }

    render() {
        //Utilizing the add modal, this is checked on render because if someone clicks sign up 
        //in the original login modal it will set state and re-render
        if(this.state.isSignUp){
            return(
                <AddUserModal isSignUp={true} isOpen={true} hideModal={this.hideModal}/>
            )
        }else{
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className="modalHeader">
                    <h3>Log In</h3>
                </div>
                <form onSubmit={(event) => {event.preventDefault(); this.login();}}>
                    <div className="modalBody">
                    {this.state.isError ? <label className='errorMessage'>{this.state.error === 'User is not activated' ? this.state.error : null}</label> : null}
                        <fieldset id='modalBody_Username'>
                            <h4 className="inputTitle">Username: </h4>
                            <input 
                                type="text" 
                                key='userName' 
                                className={ this.state.error === 'Username is incorrect' ? "invalid" : "valid"}
                                required 
                                value={this.state.userName} 
                                onChange={(event) => {this.setState({userName: event.target.value})}}/>
                            {this.state.isError ? <label className='errorMessage'>{this.state.error === 'Username is incorrect' ? this.state.error : null}</label> : null}
                        </fieldset>
                        <fieldset id='modalBody_Password'>
                            <h4 className="inputTitle">Password: </h4>
                            <input 
                                type='password' 
                                key='password' 
                                className={ this.state.error === 'Password is incorrect' ? "invalid" : "valid"}
                                required
                                value={this.state.password} 
                                onChange={(event) => {this.setState({password: event.target.value})}}/>
                            {this.state.isError ? <label className='errorMessage'>{this.state.error === 'Password is incorrect' ? this.state.error : null}</label> : null}
                        </fieldset>
                    </div>
                    <div className="modalFooter">
                        <button type="submit" onClick={this.login}>Log in</button>
                        <button type='button' onClick={this.isSigningUp}>Sign Up</button>
                        <button type="reset" onClick={this.dismissModal}>Close</button>
                    </div>
                </form>
            </Modal>
        
        );
            }
        }
        
    
};