import React                 from 'react';

import { Modal }             from '@fluentui/react';

import { authController,
    userController,
    adminLogController }     from '../../controllers'
import { userValidation,
        sanitizeData,
        HandleOnChangeEvent } from '../inputValidation';

/*
*   Modal for adding a user
*/
const MODAL_HEADER_TITLE = 'Add User to Database';
const MODAL_HEADER_ERROR_TITLE = 'Error Has Occured';

const USER_ROLE_INFORMATION = "Roles have different permissions and access\n\nUser: Only exists to hold signed out items, and tracking purposes. No password required\n\nCustodian: Can sign items in and out. Password required\n\nAdmin: Full control over items/users, logs, and approving new users. Password required";
const USER_ROLE_INFORMATION_ICON = '?';

const INPUT_FIELD_FIRST_NAME = 'First Name';
const INPUT_FIELD_LAST_NAME = 'Last Name';
const INPUT_FIELD_USERNAME = 'Username';
const INPUT_FIELD_USER_ROLE = 'User Role';
const INPUT_FIELD_PASSWORD = 'Password';
const INPUT_FIELD_CONFIRM_PASSWORD = 'Confirm Password';
const INPUT_FIELD_PHONE_NUMBER = 'Phone Number';

const BTN_CLOSE = 'Close';
export default class AddUserModal extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:          props.isOpen,
            firstName:       '',
            lastName:        '',
            userName:        '',
            password:        '',
            confirmPassword: '',
            userRole:        props.userRole,
            phoneNumber:     '',
            status:          'active',
            pwDisabled:      true,
            pwRequired:      false,
            userRoleDisabled:false,
            isSignUp:        props.isSignUp,
            
            isControllerError:      false,
            controllerErrorMessage: '',
            isError:                false,
            errorMessage:           ''
        };

        if(props.isSignUp) {
            this.handleInputFields = new HandleOnChangeEvent('userModalAddSignUp');
        } else{
            this.handleInputFields = new HandleOnChangeEvent('userModalAdd');
        }
    };

    /* When a custodian is logged in, 
        allow only the ability to add user roles */
    async componentDidMount() {
        try {
            if(this.state.isSignUp) {
                this.setState({status: 'pending'})
            } else {
                let signedInAccount = await authController.getUserInfo();
                
                if(signedInAccount.user.user.userRole === 'custodian') {
                    this.setState({userRoleDisabled: true});
                }
            }
            //Have the default value role be user
            this.setState({userRole: 'user'});
        } catch(error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ isControllerError: true,
                            controllerErrorMessage: error.message
            });
        }
    };

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _addPendingUser = async () => {
        let userRegister = {
            firstName:      this.state.firstName,
            lastName:       this.state.lastName,
            userName:       this.state.userName,
            userRole:       'user',
            phoneNumber:    sanitizeData.sanitizePhoneNumber(this.state.phoneNumber),
            status:         'pending'
        }

        await userController.registerNewUser(userRegister)
        .then((data) => {
            if (data.status !== undefined && data.status >= 400) throw data;
            
            this.setState({ isError: false, 
                            errorMessage: ''
            });

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {  
            this.setState({ isError: true, 
                            errorMessage: err.message
            });          
        });
    }

    _addUser = async () => {
        let user = {
            firstName:      this.state.firstName,
            lastName:       this.state.lastName,
            userName:       this.state.userName,
            password:       this.state.password,
            userRole:       this.state.userRole,
            phoneNumber:    sanitizeData.sanitizePhoneNumber(this.state.phoneNumber),
            status:         this.state.status
        };
        let returnedUser = {};

        await userController.createUser(user)
            .then((data) => {
                if (data.status !== undefined && data.status >= 400) throw data;
                
                this.setState({ isError: false, 
                                errorMessage: ''
                });
                returnedUser = data;

                window.location.reload();
                this._dismissModal();
            })
            .catch(async (err) => { 
                this.setState({ isError: true, 
                                errorMessage: err.message
                });          
            });
        
            let log = {
                    itemId:     'N/A',
                    userId:     returnedUser.userName,
                    adminId:    '',
                    action:     'add',
                    content:    'user'
            };
                
            await adminLogController.createAdminLog(log);
    }
    
    _handleUserRoleChange = (event) => {
        if(event.target.value === 'user') {
            this.setState({
                pwDisabled: true, 
                pwRequired: false, 
                password: '',
                confirmPassword: '',
                userRole: event.target.value
            });
        } else {
            this.setState({
                pwDisabled: false, 
                pwRequired: true, 
                userRole: event.target.value
            });
        };
    };

    _handleChangeEvent = (Event, methodCall) => {
        let inputFieldID = Event.target.id;
        let inputFieldValue = Event.target.value;

        //Handles the error validation
        if(inputFieldID === 'confirmPassword'){
            this.handleInputFields.handleConfirmPassword(this.state.password, inputFieldValue, methodCall);
        } else if(inputFieldID === 'password') {
            this.handleInputFields.handlePassword(this.state.pwRequired, inputFieldValue, methodCall);
        } else if(inputFieldID === 'userRoleSelect') {
            this.handleInputFields.handleUserRoleChange(inputFieldValue);
        } else {
            this.handleInputFields.handleEvent(Event, methodCall);
        }

        if(inputFieldID === 'userRoleSelect') {
            this.setState({ userRole: sanitizeData.sanitizeWhitespace(inputFieldValue)});
            this._handleUserRoleChange(Event);
        } else {
            this.setState({ [inputFieldID]: sanitizeData.sanitizeWhitespace(inputFieldValue) });
        }
    }

    _handleFormSubmit = (Event) => {
        Event.preventDefault(); 
        if(this.state.isSignUp) {
            this._addPendingUser();
        } else{
            this._addUser();
        }
    };

    /* Builds user input form */
    _renderForm = () => {
        return(
            <>
            <div className="modalHeader">
                <h3>{MODAL_HEADER_TITLE}</h3>
            </div>
            <form onSubmit={(Event) => {this._handleFormSubmit(Event);}}>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <fieldset className={INPUT_FIELD_FIRST_NAME}>
                        <h4 className="inputTitle">{INPUT_FIELD_FIRST_NAME}</h4>
                        <input 
                            type="text" 
                            id="firstName" 
                            className={ this.handleInputFields.setClassNameIsValid("firstName") ? "valid" : "invalid"}
                            value={this.state.firstName} 
                            onChange={(Event) => this._handleChangeEvent(Event, userValidation.validateFirstName)}
                            onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validateFirstName)}
                        />
                        { this.handleInputFields.setErrorMessageDisplay("firstName") }
                    </fieldset>
                    <fieldset className={INPUT_FIELD_LAST_NAME}>
                        <h4 className="inputTitle">{INPUT_FIELD_LAST_NAME}</h4>
                        <input 
                            type="text" 
                            id="lastName" 
                            className={ this.handleInputFields.setClassNameIsValid("lastName") ? "valid" : "invalid"}
                            value={this.state.lastName}
                            onChange={(Event) => this._handleChangeEvent(Event, userValidation.validateLastName)}
                            onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validateLastName)}
                        />
                        { this.handleInputFields.setErrorMessageDisplay("lastName") }
                    </fieldset>
                    <fieldset className={INPUT_FIELD_USERNAME}>
                        <h4 className="inputTitle">{INPUT_FIELD_USERNAME}</h4>
                        <input 
                            type="text" 
                            id="userName"
                            className={ this.handleInputFields.setClassNameIsValid("userName") ? "valid" : "invalid"}
                            value={this.state.userName}
                            onChange={(Event) => this._handleChangeEvent(Event, userValidation.validateUserName)}
                            onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validateUserName)}
                        />
                        { this.handleInputFields.setErrorMessageDisplay("userName") }
                    </fieldset>
                    {this.state.isSignUp ? 
                        null :
                        <div>
                            <fieldset className={INPUT_FIELD_USER_ROLE}>
                                <h4 className="inputTitle">{INPUT_FIELD_USER_ROLE}</h4>
                                <span id='userSelect'>
                                    <select 
                                        disabled={this.state.userRoleDisabled} 
                                        id='userRoleSelect' 
                                        defaultValue={'user'} 
                                        onChange={(Event) => {this._handleChangeEvent(Event)}}
                                    >
                                        <option label='' hidden disabled ></option>
                                        <option value='user' label='User'/>
                                        <option value='custodian' label='Custodian'/>
                                        <option value='admin' label='Admin'/>
                                    </select>
                                    <div title={USER_ROLE_INFORMATION} id='roleInformation'>
                                        {USER_ROLE_INFORMATION_ICON}
                                    </div>
                                </span>
                            </fieldset>
                            <fieldset className={INPUT_FIELD_PASSWORD}>
                                <h4 className="inputTitle">{INPUT_FIELD_PASSWORD}</h4>
                                <input
                                    type="password"
                                    id="password"
                                    className={ this.handleInputFields.setClassNameIsValid("password") ? "valid" : "invalid"}
                                    disabled={this.state.pwDisabled}
                                    value={this.state.password} 
                                    onChange={(Event) => this._handleChangeEvent(Event, userValidation.validatePassword)}
                                    onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validatePassword)}
                                />
                                { this.handleInputFields.setErrorMessageDisplay("password") }
                            
                                <h4 className="inputTitle" hidden={this.state.pwDisabled}>{INPUT_FIELD_CONFIRM_PASSWORD}</h4>
                                <input 
                                    type="password"
                                    id="confirmPassword"
                                    className={ this.handleInputFields.setClassNameIsValid("confirmPassword") ? "valid" : "invalid"}
                                    hidden={this.state.pwDisabled} 
                                    disabled={this.state.pwDisabled}
                                    value={this.state.confirmPassword} 
                                    onChange={(Event) => this._handleChangeEvent(Event, userValidation.validateConfirmPassword)}
                                    onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validateConfirmPassword)}
                                />
                                { this.handleInputFields.setErrorMessageDisplay("confirmPassword") }
                            </fieldset> 
                        </div>
                    }
                    <fieldset className={INPUT_FIELD_PHONE_NUMBER}>
                        <h4 className="inputTitle">{INPUT_FIELD_PHONE_NUMBER}</h4>
                        <input
                            type="text" 
                            id="phoneNumber" 
                            placeholder="000-000-0000"
                            className={ this.handleInputFields.setClassNameIsValid("phoneNumber") ? "valid" : "invalid"}
                            value={this.state.phoneNumber}
                            onChange={(Event) => this._handleChangeEvent(Event, userValidation.validatePhoneNumber)}
                            onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validatePhoneNumber)}
                        />
                        { this.handleInputFields.setErrorMessageDisplay("phoneNumber") }
                    </fieldset>
                </div>
                <div className="modalFooter">
                    <input type='submit'
                        value='Submit'
                        disabled={this.state.isSignUp ?
                            !this.handleInputFields._isAddSignUpModalSubmitAvailable() :
                            !this.handleInputFields.isAddUserModalSubmitAvailable()
                        } 
                    />
                    <button 
                        type="reset" 
                        onClick={() => this._dismissModal()}
                    >
                        {BTN_CLOSE}
                    </button>
                </div>
            </form>
            </>
        );
    };

    /* If a backend issue occurs, display message to user */
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.errorMessage}
            </label>
        );
    };

    /* If componentDidMount error, display message to user */
    _renderErrorDisplay = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_ERROR_TITLE}</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">
                        {this.state.controllerErrorMessage}
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

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                { this.state.isControllerError ? 
                    this._renderErrorDisplay() : 
                    this._renderForm() 
                }
            </Modal>
        );
    };
};