import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    userController,
    adminLogController }    from '../../controllers'
import { userValidation,
    sanitizeData }          from '../inputValidation';

/*
*   Modal for editing a user
*/
export default class EditUserModal extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:          props.isOpen,
            idArray:         props.idArray,
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

            errorDetails:           {
                field:        '',
                errorMessage: ''
            },
            errors:                 [],
            isControllerError:      false,
            controllerErrorMessage: ''
        };
    };

    /* Logic handeling of different roles and what they are able to access:
        -Admin userRoles cannot modify their own role
        -displays selected user's userRole
        -password display/reset password logic */
    async componentDidMount() {
        try {
            let thisUser = await userController.getUserById(this.state.idArray[0]);

            //Disables userRole dropdown if the selected user is the user logged in
            if(thisUser.userId === thisUser._id) {
                this.setState({userRoleDisabled: true});
            };

            //Sets the userRole select tag to the user's role
            let selectUserRole = document.getElementById("selectUserRole");
            selectUserRole.value = thisUser.userRole;

            //Sets the status select tag to the user's status
            let selectUserStatus = document.getElementById("selectUserStatus");
            selectUserStatus.value = thisUser.status;

            /* Will set password reset button to show and track that 
                the user has a password already if they were originally
                a custodian or admin.*/
            if(thisUser.userRole !== 'user') {
                this.setState({ resetBtn: true, 
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
            this.setState({ isControllerError: true,
                            controllerErrorMessage: 'An error occured while loading. Please refresh and try again.'
            });
        }
    };

    _dismissModal = () => {
        this.setState({ isOpen: false });
    };

    async _editUser() {
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

            //Checks if any user that is going to get deleted has any items signed out
            let res = await userController.checkSignouts(user, unavailableItems);
            if (res.status === 'error') {
                this.setState({ isControllerError: true, 
                                controllerErrorMessage: res.message
                });
                return;
            } else {
                this.setState({ isControllerError: false,
                                controllerErrorMessage: ''
                });
            };
        };

        let log = {
            itemId:     'N/A',
            userId:     this.state.idArray[0],
            adminId:    '',
            action:     'edit',
            content:    'user'
        };

        await userController.updateUser(this.state.idArray[0], user)
        .then(async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ isControllerError: false, 
                            controllerErrorMessage: ''
            });
            
            await adminLogController.createAdminLog(log);

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ isControllerError: true, 
                            controllerErrorMessage: err.message
            }); 
        });
    };

    _handleUserRoleChange(Event) {
        if(Event.target.value === 'user') {
            this.setState({ 
                password: '', 
                userRole: Event.target.value, 
                pwRequired: false, 
                pwDisabled: true, 
                resetBtn: false 
            });
        } else if(Event.target.value !== 'user' && !this.state.hasPassword){
            this.setState({ 
                password: '', 
                userRole: Event.target.value, 
                pwRequired: true, 
                pwDisabled: false, 
                resetBtn: false 
            });
        } else {
            this.setState({
                password: '', 
                userRole: Event.target.value, 
                pwRequired: false, 
                pwDisabled: true, 
                resetBtn: true 
            });
        };
    };

    _allowPasswordReset() {
        this.setState({
            pwDisabled: false, 
            pwRequired: true, 
            resetBtn: false
        });
    };

    /* For the given field, identified by fieldID
        determine is errors has an assoicated error message to display */
    _displayErrorMessage(fieldID){
        let errorDetail = this._returnErrorDetails(fieldID);

        if(errorDetail) {
            if(fieldID === 'password' || fieldID === 'confirmPassword') {
                return(
                    <label className="errorMessage" hidden={this.state.pwDisabled}>
                        {errorDetail.errorMessage}
                    </label>
                );
            } else{
                return(
                    <label className="errorMessage">
                        {errorDetail.errorMessage}
                    </label>
                );
            }
        } else if(fieldID === 'password' && !this.state.pwDisabled) {
            return(
                <label className="passwordRequirements">
                    Must Include: lowercase/uppercase/number/symbol
                </label>
            );
        }
        return(
            <label className="emptyLabel">
                This is filler
            </label>);
    };

    /* When an errorDetail is no longer present, remove from errors list */
    _handleRemoveError(fieldID) {
        const updatedErrors = this.state.errors.filter(errorDetails => errorDetails.field !== fieldID);
        this.setState({errors: updatedErrors});
    };

    /* Loops through the errors list
        returns the errorDetail or false if it doesn't exists */
    _returnErrorDetails(fieldID) {
        let errorList = this.state.errors;

        if(errorList) {
            for(let index = 0; index < errorList.length; index++) {
                if(errorList[index].field === fieldID) {
                    return errorList[index];
                }
            }
        }
        return false;
    };

    /* Useability Feature:
        submit button is only enabled when no errors are detected */
    _isSubmitAvailable() {
        if(userValidation.validateSubmit(
            this.state.firstName, 
            this.state.lastName, 
            this.state.userName, 
            this.state.userRole, 
            this.state.phoneNumber, 
            this.state.pwRequired, 
            this.state.password) && 
            this.state.errors.length === 0
        ){
            return true;
        }
        return false;
    };

    /* Primary purpose:
        indicate to user that field is required when user clicks off field without entering any information
        isEmpty in userValidation is triggered and error is returned for display */
    _handleBlur(validationFunc, Event) {
        const fieldID = Event.target.id;
        const fieldVal = Event.target.value;
        const isErrorSet = this._returnErrorDetails(fieldID);

        if(fieldID === 'password' && 
            validationFunc(this.state.pwRequired, fieldVal) && 
            isErrorSet === false
        ) {
            let errorDetail = {
                field:        fieldID,
                errorMessage: validationFunc(this.state.pwRequired, fieldVal)
            };

            this.setState(prevState => ({
                errorDetails: {
                    ...prevState.errorDetails,
                    field:        fieldID,
                    errorMessage: validationFunc(this.state.pwRequired, fieldVal)
                },
                errors: [
                    ...prevState.errors,
                    errorDetail
                ]
            }));
        } else if(fieldID === 'confirmPassword' && 
                    validationFunc(this.state.password, fieldVal) && 
                    isErrorSet === false
        ) {
            let errorDetail = {
                field:        fieldID,
                errorMessage: validationFunc(this.state.password, fieldVal)
            };

            this.setState(prevState => ({
                errorDetails: {
                    ...prevState.errorDetails,
                    field:        fieldID,
                    errorMessage: validationFunc(this.state.password, fieldVal)
                },
                errors: [
                    ...prevState.errors,
                    errorDetail
                ]
            }));
        } else if(fieldID !== 'password' && 
                    fieldID !== 'confirmPassword' && 
                    validationFunc(fieldVal) && 
                    isErrorSet === false
        ) {
            //To update the list of error, we need an object preset with the inform, as we can't collect from setState errorDetails
            let errorDetail = {
                field:        fieldID,
                errorMessage: validationFunc(fieldVal)
            };

            this.setState(prevState => ({
                errorDetails: {
                    ...prevState.errorDetails,
                    field:        fieldID,
                    errorMessage: validationFunc(fieldVal)
                },
                errors: [
                    ...prevState.errors,
                    errorDetail
                ]
            }));
        }  
        return;
    };

    /* Provide user immediate field requirement:
        check if user is producing errors -> validateOnChange is true
        updates the value of the state for that field */
    _handleChange(validationFunc, Event) {
        const fieldID = Event.target.id;
        const fieldVal = Event.target.value;

        /* If something is returned from the passed function, an error occured 
            since an error was returned, set the error state if not already set
        */
            if(!this._returnErrorDetails(fieldID)) {   //Does the error already exist? no
                switch(fieldID) {
                    case 'password':
                        let result = validationFunc(this.state.pwRequired, fieldVal);
                        if(result) {
                            let errorDetail = {
                                field:        fieldID,
                                errorMessage: result
                            };
                
                            this.setState( prevState => ({
                                errorDetails: {
                                    ...prevState.errorDetails,
                                    field:        fieldID,
                                    errorMessage: result
                                },
                                errors: [
                                    ...prevState.errors,
                                    errorDetail
                                ]
                            }));
                        }
                        break;
                    case 'confirmPassword':
                        if(validationFunc(this.state.password, fieldVal)) {
                            let errorDetail = {
                                field:        fieldID,
                                errorMessage: validationFunc(this.state.password, fieldVal)
                            };
                
                            this.setState(prevState => ({
                                errorDetails: {
                                    ...prevState.errorDetails,
                                    field:        fieldID,
                                    errorMessage: validationFunc(this.state.password, fieldVal)
                                },
                                errors: [
                                    ...prevState.errors,
                                    errorDetail
                                ]
                            }));
                        }
                        break;
                    default:
                        if(validationFunc(fieldVal)) {
                            //To update the list of error, we need an object preset with the inform, as we can't collect from setState errorDetails
                            let errorDetail = {
                                field:        fieldID,
                                errorMessage: validationFunc(fieldVal)
                            };
    
                            this.setState(prevState => ({
                                errorDetails: {
                                    ...prevState.errorDetails,
                                    field:        fieldID,
                                    errorMessage: validationFunc(fieldVal)
                                },
                                errors: [
                                    ...prevState.errors,
                                    errorDetail
                                ]
                            }));
                        }
                        break;
                }
            }else{
                switch(fieldID) {
                    case 'password':
                        if(!validationFunc(this.state.pwRequired, fieldVal)){ //If no error
                            this.setState( prevState => ({
                                errorDetails: {
                                    ...prevState.errorDetails,
                                    field:        '',
                                    errorMessage: ''
                                }
                            }));
                            this._handleRemoveError(fieldID);
                        } else {
                            let result = validationFunc(this.state.pwRequired, fieldVal);
                            let prevError = this._returnErrorDetails(fieldID);
    
                            if(result !== prevError.errorMessage) {
                                this._handleRemoveError(fieldID);
                                let errorDetail = {
                                    field:        fieldID,
                                    errorMessage: result
                                };
                    
                                this.setState( prevState => ({
                                    errorDetails: {
                                        ...prevState.errorDetails,
                                        field:        fieldID,
                                        errorMessage: result
                                    },
                                    errors: [
                                        ...prevState.errors,
                                        errorDetail
                                    ]
                                }));
                            };
                        };
                        break;
                    case 'confirmPassword':
                        if(!validationFunc(this.state.password, fieldVal)) {
                            this.setState(prevState => ({
                                errorDetails: {
                                    ...prevState.errorDetails,
                                    field:        '',
                                    errorMessage: ''
                                }
                            }));
                            this._handleRemoveError(fieldID);
                        }
                        break;
                    default:
                        if(!validationFunc(fieldVal)) {
                            this.setState(prevState => ({
                                errorDetails: {
                                    ...prevState.errorDetails,
                                    field:        '',
                                    errorMessage: ''
                                }
                            }));
                            this._handleRemoveError(fieldID);
                        }
                        break;
                }
            }

        //Update the state for whatever field is being modified
        switch(fieldID) {
            case 'firstName':
                this.setState({firstName: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'lastName':
                this.setState({lastName: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'userName':
                this.setState({userName: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'userRole':
                this.setState({userRole: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'password':
                this.setState({password: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'confirmPassword':
                this.setState({confirmPassword: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'phoneNumber':
                this.setState({phoneNumber: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'selectUserStatus':
                this.setState({status: fieldVal});
                break;                                                                       
            default:
                break;
        }
    };

    /* Builds user input form */
    _buildForm(){
        return(
            <>
            <div className="modalHeader">
                <h3>Edit User</h3>
            </div>
            <form onSubmit={(Event) => {Event.preventDefault(); this._editUser();}}>
                <div className="modalBody">
                    <fieldset>
                        <h4 className="inputTitle">First Name</h4>
                        <input 
                            type="text" 
                            id="firstName"
                            className={ this._returnErrorDetails("firstName") ? "invalid" : "valid"}
                            value={this.state.firstName} 
                            onChange={(evt) => this._handleChange(userValidation.validateFirstName, evt)}
                            onBlur={(evt) => this._handleBlur(userValidation.validateFirstName, evt)}
                        />
                        {this._displayErrorMessage('firstName')}
                    </fieldset>
                    <fieldset>
                        <h4 className="inputTitle">Last Name</h4>
                        <input 
                            type="text" 
                            id="lastName"
                            className={ this._returnErrorDetails("lastName") ? "invalid" : "valid"}
                            value={this.state.lastName}
                            onChange={(evt) => this._handleChange(userValidation.validateLastName, evt)}
                            onBlur={(evt) => this._handleBlur(userValidation.validateLastName, evt)}
                        />
                        {this._displayErrorMessage('lastName')}
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
                                    id="selectUserRole"  
                                    className={ this._returnErrorDetails("selectUser") ? "invalid" : "valid"}
                                    onChange={(Event) => this._handleUserRoleChange(Event)}
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
                                    className={ this._returnErrorDetails("selectUser") ? "invalid" : "valid"}
                                    onChange={(Event) => this.setState({status: Event.target.value})}
                                >
                                    <option id="activeOpt" value="active">Active</option>
                                    <option id="inactiveOpt" value="inactive">Inactive</option>
                                </select>
                        </div>
                    </div>
                    {this._displayErrorMessage("userRole")}
                    <fieldset>
                        <h4 className="inputTitle">Password</h4>
                        <span>
                            <input 
                                type="password"
                                id="password"
                                className={ this._returnErrorDetails("password") ? "invalid" : "valid"}
                                disabled={this.state.pwDisabled}
                                value={this.state.password} 
                                onChange={(evt) => this._handleChange(userValidation.validatePassword, evt)}
                                onBlur={(evt) => this._handleBlur(userValidation.validatePassword, evt)}
                            />
                            <button hidden={!this.state.resetBtn} onClick={(event) => {event.preventDefault(); this.allowPasswordReset()}}>Reset</button>
                        </span>
                        {this._displayErrorMessage("password")}
                        <h4 className="inputTitle" hidden={this.state.pwDisabled}>Confirm Password</h4>
                            <input 
                                type="password"
                                id="confirmPassword"
                                className={ this._returnErrorDetails("confirmPassword") ? "invalid" : "valid"}
                                hidden={this.state.pwDisabled}
                                value={this.state.confirmPassword} 
                                onChange={(evt) => this._handleChange(userValidation.validatePasswordConfirm, evt)}
                                onBlur={(evt) => this._handleBlur(userValidation.validatePasswordConfirm, evt)}
                            />
                            {this._displayErrorMessage('confirmPassword')}
                    </fieldset>
                    <fieldset>
                        <h4 className="inputTitle">Phone Number</h4>
                        <input
                            type="text" 
                            id="phoneNumber"
                            className={ this._returnErrorDetails("phoneNumber") ? "invalid" : "valid"}
                            value={this.state.phoneNumber}
                            onChange={(evt) => this._handleChange(userValidation.validatePhoneNumber, evt)}
                            onBlur={(evt) => this._handleBlur(userValidation.validatePhoneNumber, evt)}
                        />
                        {this._displayErrorMessage('phoneNumber')}
                    </fieldset>
                </div>
                <div className="modalFooter">
                <input type='submit' value='Submit' disabled={!this._isSubmitAvailable()} />
                    <button type="reset" onClick={this._dismissModal}>Close</button>
                </div>
            </form>
            </>
        );
    };

    /* If a backend issue occurs, display message to user */
    _buildErrorDisplay(){
        return(
            <>
            <div className="modalHeader">
                <h3>Error Has Occured</h3>
            </div>
            <div className="modalBody">
                <p className="errorMessage">
                    {this.state.controllerErrorMessage} 
                </p>
            </div>
            <div className="modalFooter">
                <button type="reset" onClick={this._dismissModal}>Close</button>
            </div>
            </>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                { this.state.isControllerError ? this._buildErrorDisplay() : this._buildForm() }
            </Modal>
        );
    };
};