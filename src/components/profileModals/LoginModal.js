import React                        from 'react';

import { Modal }                    from '@fluentui/react';

import { loginLogoutController }    from '../../controllers';
import { AddUserModal }             from '../userModals';

const LOGIN_ATTEMPT_EXCEEDED = 'Max Login Attempts Exceeded. Please try again later.';
const FAILED_LOGIN_DEFAULT = 'Username/Password is incorrect';
const BACKEND_GENERATED_ERRORMESSAGES = [
    '"userName" is not allowed to be empty',
    '"password" is not allowed to be empty', 
    '"userName" length must be at least 6 characters long',
    '"password" length must be at least 8 characters long'
];

const MODAL_HEADER_TITLE = 'Log In';
const MODAL_HEADER_ERROR_TITLE = 'Max Login Attempt Exceeded';

const INPUT_FIELD_USERNAME = 'Username: ';
const INPUT_FIELD_PASSWORD = 'Password: ';
const MODAL_ERROR_MESSAGE = 'Please try again later.';

const BTN_LOGIN = 'Log In';
const BTN_SIGNUP = 'Sign Up';
const BTN_CLOSE = 'Close';

/*
*   Modal for logging in
*/
export default class LoginModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            isOpen          : props.isOpen,
            userName        : '',
            password        : '',
            isError         : false,
            errorMessage    : ''
        };
    }

    _dismissModal = () => {
        this.setState({isOpen: false});
    }

    //login function to run username password to database and perform login
    _login = async () => {
        await loginLogoutController.login(this.state.userName, this.state.password)
        .then((auth) => {
            if(auth.status >= 400) throw auth;
            this.setState({
                isError: false,
                errorMessage: ''
            });
            this.props.setAuth(auth);
            this._dismissModal();
            //reload so the page re-renders with red dot notification by pending
            window.location.reload();
        })
        .catch(async (err) => {
            if(BACKEND_GENERATED_ERRORMESSAGES.includes(err.message)) {
                this.setState({
                    isError     : true,
                    errorMessage: FAILED_LOGIN_DEFAULT
                });
            } else {
                this.setState({
                    isError     : true,
                    errorMessage: err.message
                });
            }
        });
    }

    //method to set issignup = true to allow correct modal to be displayed on re-render
    _isSigningUp = () => {
        this.setState({ isSignUp: true });
    }

    //successful render method
    _renderLoginForm = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_TITLE}</h3>
                </div>
                <form onSubmit={(event) => {event.preventDefault();}}>
                    <div className="modalBody">
                        {this.state.isError ?
                            this._renderErrorMessage() :
                            null
                        }
                        <fieldset id="modalBody_Username">
                            <h4 className="inputTitle">{INPUT_FIELD_USERNAME}</h4>
                            <input 
                                type="text" 
                                key="userName" 
                                className={this.state.isControllerError ? "invalid" : "valid"}
                                value={this.state.userName} 
                                onChange={(event) => {this.setState({userName: event.target.value})}}
                            />
                        </fieldset>
                        <fieldset id="modalBody_Password">
                            <h4 className="inputTitle">{INPUT_FIELD_PASSWORD}</h4>
                            <input 
                                type="password" 
                                key="password" 
                                className={this.state.isControllerError ? "invalid" : "valid"}
                                value={this.state.password} 
                                onChange={(event) => {this.setState({password: event.target.value})}}
                            />
                        </fieldset>
                    </div>
                    <div className="modalFooter">
                        <button type="submit" onClick={this._login}>{BTN_LOGIN}</button>
                        <button type='button' onClick={this._isSigningUp}>{BTN_SIGNUP}</button>
                        <button type="reset" onClick={this._dismissModal}>{BTN_CLOSE}</button>
                    </div>
                </form>
            </>
        );
    }
    //Display Attempt errors if unsucessfully login
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.errorMessage}
            </label>
        );
    }

    //Prevent brute force attacks
    _renderMaxLoginAttemptsError = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_ERROR_TITLE}</h3>
                </div>
                <div className="modalBody">
                    <p>
                        {MODAL_ERROR_MESSAGE}
                    </p>
                </div>
                <div className="modalFooter">
                    <button 
                        type="reset" 
                        onClick={this._dismissModal}
                    >
                        {BTN_CLOSE}
                    </button>
                </div>
            </>
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
                    {this.state.errorMessage === LOGIN_ATTEMPT_EXCEEDED ?
                        this._renderMaxLoginAttemptsError() :
                        this._renderLoginForm()}
                </Modal>
            );
        };
    }
}