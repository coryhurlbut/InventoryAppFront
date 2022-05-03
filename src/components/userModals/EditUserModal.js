import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    userController,
    adminLogController }    from '../../controllers'
import { userValidation,
    sanitizeData,
    HandleOnChangeEvent }   from '../inputValidation';

/*
*   Modal for editing a user
*/
export default class EditUserModal extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:          props.isOpen,
            selectedIds:     props.selectedIds,
            selectedObjects: props.selectedObjects,
            firstName:       '',
            lastName:        '',
            userName:        '',
            password:        '',
            confirmPassword: '',
            userRole:        '',
            phoneNumber:     '',
            status:          '',
            pwDisabled:      true,
            pwRequired:      false,
            hasPassword:     false,
            resetBtn:        false,
            userId:          '',
            userRoleDisabled:false,

            isControllerError:      false,
            controllerErrorMessage: '',
            isError:                false,
            errorMessage:           ''
        };
        this.handleInputFields = new HandleOnChangeEvent('userModalEdit');
    };

    /* Logic handeling of different roles and what they are able to access:
        -Admin userRoles cannot modify their own role
        -displays selected user's userRole
        -password display/reset password logic */
    async componentDidMount() {
        try {
            let res = await userController.getUserByUserName(this.state.selectedIds[0]);
            let thisUser = res[0];
            //Disables userRole dropdown if the selected user is the user logged in
            if(res.adminUserName === thisUser.userName) {
                this.setState({userRoleDisabled: true});
            };

            //Sets the userRole select tag to the user's role
            let selectUserRole = document.getElementById("userRoleSelect");
            selectUserRole.value = thisUser.userRole;

            //Sets the status select tag to the user's status
            let selectUserStatus = document.getElementById("selectUserStatus");
            selectUserStatus.value = thisUser.status;

            /* Will set password reset button to show and track that 
                the user has a password already if they were originally
                a custodian or admin.*/
            if(thisUser.userRole !== 'user') {
                this.setState({ 
                    resetBtn: true, 
                    hasPassword: true
                });
            };

            this.setState({
                firstName:   thisUser.firstName, 
                lastName:    thisUser.lastName,
                userName:    thisUser.userName,
                userRole:    thisUser.userRole,
                phoneNumber: thisUser.phoneNumber,
                userId:      thisUser.userId,
                status:      thisUser.status
            });
        } catch(error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ 
                isControllerError: true,
                controllerErrorMessage: 'An error occured while loading. Please refresh and try again.'
            });
        };
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _editUser = async () => {
        let user = {
            firstName:   this.state.firstName,
            lastName:    this.state.lastName,
            userName:    this.state.userName,
            password:    this.state.password,
            userRole:    this.state.userRole,
            phoneNumber: sanitizeData.sanitizePhoneNumber(this.state.phoneNumber),
            status:      this.state.status,
            hasPassword: this.state.hasPassword
        };

        //Checks if items are signed out to user if admin is trying to deactivate the account.
        if(user.status === 'inactive') {
            let unavailableItems = await itemController.getUnavailableItems();

            //Controller function takes an array so we have to put the user into an array.
            let userToCheck = [];
            userToCheck.push(user);

            //Checks if any user that is going to get deleted has any items signed out
            let res = await userController.checkSignouts(userToCheck, unavailableItems);
            if (res.status === 'error') {
                this.setState({ 
                    isError: true, 
                    errorMessage: res.message
                });
                return;
            } else {
                this.setState({
                    isError: false,
                    errorMessage: ''
                });
            };
        };

        let log = {
            itemId:     'N/A',
            userId:     this.state.selectedIds[0],
            adminId:    '',
            action:     'edit',
            content:    'user'
        };

        await userController.updateUser(user)
        .then(async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ 
                isError: false, 
                errorMessage: ''
            });
            
            await adminLogController.createAdminLog(log);

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ 
                isError: true, 
                errorMessage: err.message
            }); 
        });
    };

    _handleUserRoleChange = (Event) => {
        if(Event.target.value === 'user') {
            this.setState({ 
                password: '',
                confirmPassword: '',
                userRole: Event.target.value, 
                pwRequired: false, 
                pwDisabled: true, 
                resetBtn: false 
            });
        } else if(Event.target.value !== 'user' && !this.state.hasPassword){
            this.setState({ 
                password: '', 
                confirmPassword: '',
                userRole: Event.target.value, 
                pwRequired: true, 
                pwDisabled: false, 
                resetBtn: false 
            });
        } else {
            this.setState({
                password: '',
                confirmPassword: '',
                userRole: Event.target.value, 
                pwRequired: false, 
                pwDisabled: true, 
                resetBtn: true 
            });
        };
    };

    _allowPasswordReset = () => {
        this.setState({
            pwDisabled: false, 
            pwRequired: true, 
            resetBtn: false
        });
    };

    _handleChangeEvent = (Event, methodCall) => {
        let inputFieldID = Event.target.id;
        let inputFieldValue = Event.target.value;

        //Handles the error validation
        if(inputFieldID === 'confirmPassword'){
            this.handleInputFields.handleConfirmPassword(this.state.password, inputFieldValue, methodCall);
        } else if(inputFieldID === 'password') {
            this.handleInputFields.handlePassword(this.state.pwRequired, inputFieldValue, methodCall);
        }  else if(inputFieldID === 'userRoleSelect') {
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

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._editUser();
    }

    /* Builds user input form */
    _renderForm = () => {
        return(
            <>
            <div className="modalHeader">
                <h3>Edit User</h3>
            </div>
            <form onSubmit={(Event) => {this._handleFormSubmit(Event);}}>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <fieldset>
                        <h4 className="inputTitle">First Name</h4>
                        <input 
                            type="text" 
                            id="firstName"
                            className={ this.handleInputFields.setClassNameIsValid("firstName") ? "valid" : "invalid"}
                            value={this.state.firstName} 
                            onChange={(Event) => this._handleChangeEvent(Event, userValidation.validateFirstName)}
                            onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validateFirstName)}
                        />
                        {this.handleInputFields.setErrorMessageDisplay('firstName')}
                    </fieldset>
                    <fieldset>
                        <h4 className="inputTitle">Last Name</h4>
                        <input 
                            type="text" 
                            id="lastName"
                            className={ this.handleInputFields.setClassNameIsValid("lastName") ? "valid" : "invalid"}
                            value={this.state.lastName}
                            onChange={(Event) => this._handleChangeEvent(Event, userValidation.validateLastName)}
                            onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validateLastName)}
                        />
                        {this.handleInputFields.setErrorMessageDisplay('lastName')}
                    </fieldset>
                    <fieldset>
                        <h4 className="inputTitle">Username</h4>
                        <input 
                            type="text" 
                            id="userName"
                            disabled
                            value={this.state.userName}
                        />
                     </fieldset>
                    <div className="sideBySide">
                        <div className="userRole">
                            <h4 className="inputTitle">User's Role</h4>
                                <select 
                                    disabled={this.state.userRoleDisabled} 
                                    id="userRoleSelect"  
                                    className="valid"
                                    onChange={(Event) => {this._handleChangeEvent(Event)}}
                                >
                                    <option id="userOpt" value="user">User</option>
                                    <option id="custodianOpt" value="custodian">Custodian</option>
                                    <option id="adminOpt" value="admin">Admin</option>
                                </select>
                        </div>
                        <div className="userStatus">
                            <h4 className="inputTitle">Status</h4>
                                <select 
                                    disabled={this.state.userRoleDisabled} 
                                    id="selectUserStatus" 
                                    className="valid"
                                    onChange={(Event) => this.setState({status: Event.target.value})}
                                >
                                    <option id="activeOpt" value="active">Active</option>
                                    <option id="inactiveOpt" value="inactive">Inactive</option>
                                </select>
                        </div>
                    </div>
                    {this.handleInputFields.setErrorMessageDisplay("userRole")}
                    <fieldset>
                        <h4 className="inputTitle">Password</h4>
                        <span>
                            <input 
                                type="password"
                                id="password"
                                className={ this.handleInputFields.setClassNameIsValid("password") ? "valid" : "invalid"}
                                disabled={this.state.pwDisabled}
                                value={this.state.password} 
                                onChange={(Event) => this._handleChangeEvent(Event, userValidation.validatePassword)}
                                onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validatePassword)}
                            />
                            <button hidden={!this.state.resetBtn} onClick={(event) => {event.preventDefault(); this._allowPasswordReset()}}>Reset</button>
                        </span>
                        {this.handleInputFields.setErrorMessageDisplay("password", this.state.pwDisabled)}
                        <h4 className="inputTitle" hidden={this.state.pwDisabled}>Confirm Password</h4>
                            <input 
                                type="password"
                                id="confirmPassword"
                                className={ this.handleInputFields.setClassNameIsValid("confirmPassword") ? "valid" : "invalid"}
                                hidden={this.state.pwDisabled}
                                value={this.state.confirmPassword} 
                                onChange={(Event) => this._handleChangeEvent(Event, userValidation.validateConfirmPassword)}
                                onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validateConfirmPassword)}
                            />
                            {this.handleInputFields.setErrorMessageDisplay('confirmPassword')}
                    </fieldset>
                    <fieldset>
                        <h4 className="inputTitle">Phone Number</h4>
                        <input
                            type="text" 
                            id="phoneNumber"
                            placeholder="000-000-0000"
                            className={ this.handleInputFields.setClassNameIsValid("phoneNumber") ? "valid" : "invalid"}
                            value={this.state.phoneNumber}
                            onChange={(Event) => this._handleChangeEvent(Event, userValidation.validatePhoneNumber)}
                            onBlur={(Event) => this._handleChangeEvent(Event, userValidation.validatePhoneNumber)}
                        />
                        {this.handleInputFields.setErrorMessageDisplay('phoneNumber')}
                    </fieldset>
                </div>
                <div className="modalFooter">
                    <input type='submit' value='Submit' disabled={!this.handleInputFields.isAddUserModalSubmitAvailable()} />
                    <button type="reset" onClick={this._dismissModal}>Close</button>
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
                    <h3>Error Has Occured</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">
                        {this.state.controllerErrorMessage}
                    </p>
                </div>
                <div className="modalFooter">
                    <button type="reset" onClick={this._dismissModal}>Close</button>
                </div>
            </>
        );
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                { this.state.isControllerError ? this._renderErrorDisplay() : this._renderForm() }
            </Modal>
        );
    };
};