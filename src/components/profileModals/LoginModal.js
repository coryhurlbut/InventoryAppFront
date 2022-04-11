import React                        from 'react';

import { Modal }                    from '@fluentui/react';

import { loginLogoutController }    from '../../controllers';
import { AddUserModal }             from '../userModals';

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
    }

    _dismissModal = () => {
        this.setState({isOpen: false});
    }

    _login = async () => {
        await loginLogoutController.login(this.state.userName, this.state.password)
        .then((auth) => {
            if(auth.status >= 400) throw auth;
            this.setState({ error: '', isError: false });
            this.props.setAuth(auth);
            this._dismissModal();
        })
        .catch(async (err) => {    
            this.setState({ error: err.message, isError: true });
        });
    }

    _isSigningUp = () => {
        this.setState({ isSignUp: true });
    }

    _renderIfError = (message) => {
        if(!this.state.isError) return null;

        return (
            <label className="errorMessage">
                {
                    this.state.error === message ? 
                        this.state.error : 
                        null
                }
            </label>
        );
    }
    hideModal = () => {
        this.props.hideModal();
        this._dismissModal();
    }

    render() {
        //Utilizing the add modal, this is checked on render because if someone clicks sign up 
        //in the original login modal it will set state and re-render
        if(this.state.isSignUp) {
            return(
                <AddUserModal userRole={'user'} isSignUp={true} isOpen hideModal={this.hideModal}/>
            )
        } else {
            return(
                <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                    <div className="modalHeader">
                        <h3>Log In</h3>
                    </div>
                    <form onSubmit={(event) => {event.preventDefault(); this._login();}}>
                        <div className="modalBody">
                        {this._renderIfError("User is not activated")}
                            <fieldset id="modalBody_Username">
                                <h4 className="inputTitle">Username: </h4>
                                <input 
                                    type="text" 
                                    key="userName" 
                                    className={this.state.error === "Username is incorrect" ? "invalid" : "valid"}
                                    required 
                                    value={this.state.userName} 
                                    onChange={(event) => {this.setState({userName: event.target.value})}}
                                />
                                {this._renderIfError("Username is incorrect")}
                            </fieldset>
                            <fieldset id="modalBody_Password">
                                <h4 className="inputTitle">Password: </h4>
                                <input 
                                    type="password" 
                                    key="password" 
                                    className={this.state.error === "Password is incorrect" ? "invalid" : "valid"}
                                    required
                                    value={this.state.password} 
                                    onChange={(event) => {this.setState({password: event.target.value})}}/>
                                {this._renderIfError("Password is incorrect")}
                            </fieldset>
                        </div>
                        <div className="modalFooter">
                            <button type="submit" onClick={this._login}>Log in</button>
                            <button type='button' onClick={this._isSigningUp}>Sign Up</button>
                            <button type="reset" onClick={this._dismissModal}>Close</button>
                        </div>
                    </form>
                </Modal>
            );
        };
    }
}