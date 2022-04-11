import React                from 'react';

import { Modal }            from '@fluentui/react';

import { authController,
    userController,
    adminLogController }    from '../../controllers'
import { userValidation,
    sanitizeData }          from '../inputValidation';



const roleInfo = "Roles have different permissions and access\n\nUser: Only exists to hold signed out items, and tracking purposes. No password required\n\nCustodian: Can Sign items in and out. Password required\n\nAdmin: Full control over items/users, logs, and approving new users. Password required";
/*
*   Modal for adding a user
*/
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
            
            errorDetails:           {
                field:        '',
                errorMessage: ''
            },
            errors:                 [],
            isControllerError:      false,
            controllerErrorMessage: ''
        };
    };

    /* When a custodian is logged in, 
        allow only the ability to add user roles */
    async componentDidMount() {
        try {
            let signedInAccount = await authController.getUserInfo();
            if(this.isSignUp){this.setState({ status: 'pending', userRole: 'user' })}

            if(signedInAccount.user.user.userRole === 'custodian') {
                //Front end display so it show's user is selected
                let select = document.getElementById('selectUser');
                select.value = 'user';

                //Backend functionality of setting the role to a user
                this.setState({ userRoleDisabled: true,
                                userRole: 'user'
                });
            }
        } catch(error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ isControllerError: true,
                            controllerErrorMessage: 'An error occured while loading. Please refresh and try again.'
            });
        }
        
    };

    _dismissModal() {
        this.setState({isOpen: false});
    };

    async _addUser() {
        let user = {
            firstName:      this.state.firstName,
            lastName:       this.state.lastName,
            userName:       this.state.userName,
            password:       this.state.password,
            userRole:       this.state.userRole,
            phoneNumber:    sanitizeData.sanitizePhoneNumber(this.state.phoneNumber),
            status:         this.state.status
        };
        //alternate data model for user sign up
        let userRegister = {
            firstName:      this.state.firstName,
            lastName:       this.state.lastName,
            userName:       this.state.userName,
            userRole:       'user',
            phoneNumber:    sanitizeData.sanitizePhoneNumber(this.state.phoneNumber),
            status:         'pending'
        }
        let returnedUser = {};
        if(this.state.isSignUp){
            await userController.registerNewUser(userRegister)
            .then((data) => {
                if (data.status !== undefined && data.status >= 400) throw data;
                
                this.setState({ isControllerError: false, 
                                controllerErrorMessage: ''});
                returnedUser = data;
    
                window.location.reload();
                this._dismissModal();
            })
            .catch( async (err) => {  
                this.setState({ isControllerError: true, 
                                controllerErrorMessage: err.message});          
            });
        await userController.createUser(user)
        .then((data) => {
            if (data.status !== undefined && data.status >= 400) throw data;
            
            this.setState({ isControllerError: false, 
                            controllerErrorMessage: ''
            });
            returnedUser = data;

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {  
            this.setState({ isControllerError: true, 
                            controllerErrorMessage: err.message
            });          
        });
       
         let log = {
                itemId:     'N/A',
                userId:     returnedUser._id,
                adminId:    '',
                action:     'add',
                content:    'user'
         }
            
        await adminLogController.createAdminLog(log);
        }
        
    };
    
    _enablePasswordEdit(event) {
        if(event.target.value === 'user') {
            this.setState({
                pwDisabled: true, 
                pwRequired: false, 
                password: '', 
                userRole: event.target.value
            });
            this.setState( prevState => ({
                errorDetails: {
                    ...prevState.errorDetails,
                    field:        '',
                    errorMessage: ''
                }
            }));

            if(this._returnErrorDetails('password')){
                this._handleRemoveError('password');
            } else if(this._returnErrorDetails('confirmPassword')){
                this._handleRemoveError('confirmPassword');
            }
        } else {
            this.setState({
                pwDisabled: false, 
                pwRequired: true, 
                userRole: event.target.value
            });
        };
    };

    /* For the given field, identified by fieldID
        determine is errors has an assoicated error message to display */
    _displayErrorMessage(fieldID) {
        let errorDetail = this._returnErrorDetails(fieldID);

        if(errorDetail) {
            if(fieldID === 'password' || fieldID === 'confirmPassword') {
                return(
                    <label className="errorMessage" hidden={this.state.pwDisabled}> 
                        { errorDetail.errorMessage} 
                    </label>
                );
            } else{
                return(
                    <label className="errorMessage"> 
                        { errorDetail.errorMessage} 
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
        return <label className="emptyLabel">This is filler</label>;
    };

    /* When an errorDetail is no longer present, remove from errors list */
    _handleRemoveError = (fieldID) => {
        const updatedErrors = this.state.errors.filter(errorDetails => errorDetails.field !== fieldID);
        this.setState({ errors: updatedErrors});
    };
    
    /* Loops through the errors list
        returns the errorDetail or false if it doesn't exists */
    _returnErrorDetails(fieldID){
        let errorList = this.state.errors;

        if(errorList){
            for (let index = 0; index < errorList.length; index++) {
                if(errorList[index].field === fieldID){
                    return errorList[index];
                }
            }
        }
        return false;
    };

    /* Useability Feature:
        submit button is only enabled when no errors are detected */
    isSumbitAvailable(){
        if(this.state.isSignUp) {
            return userValidation.validateUserRequest(
                this.state.firstName,
                this.state.lastName,
                this.state.userName,
                this.state.phoneNumber)
        } else {
            return userValidation.validateSubmit(
                this.state.firstName,
                this.state.lastName,
                this.state.userName,
                this.state.userRole,
                this.state.phoneNumber,
                this.state.pwRequired,
                this.state.password)
                && this.state.errors.length === 0
        }
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

            this.setState( prevState => ({
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

            this.setState( prevState => ({
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

            this.setState( prevState => ({
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
            switch (fieldID) {
                case 'password':
                    if(validationFunc(this.state.pwRequired, fieldVal)){
                        let errorDetail = {
                            field:        fieldID,
                            errorMessage: validationFunc(this.state.pwRequired, fieldVal)
                        };
            
                        this.setState( prevState => ({
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
                    }
                    break;
                case 'confirmPassword':
                    if(validationFunc(this.state.password, fieldVal)){
                        let errorDetail = {
                            field:        fieldID,
                            errorMessage: validationFunc(this.state.password, fieldVal)
                        };
            
                        this.setState( prevState => ({
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
                    if(validationFunc(fieldVal)){
                        //To update the list of error, we need an object preset with the inform, as we can't collect from setState errorDetails
                        let errorDetail = {
                            field:        fieldID,
                            errorMessage: validationFunc(fieldVal)
                        };

                        this.setState( prevState => ({
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
            switch (fieldID) {
                case 'password':
                    if(!validationFunc(this.state.pwRequired, fieldVal)){
                        this.setState( prevState => ({
                            errorDetails: {
                                ...prevState.errorDetails,
                                field:        '',
                                errorMessage: ''
                            }
                        }));
                        this._handleRemoveError(fieldID);
                    }
                    break;
                case 'confirmPassword':
                    if(!validationFunc(this.state.password, fieldVal)){
                        this.setState( prevState => ({
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
                    if(!validationFunc(fieldVal)){
                        this.setState( prevState => ({
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
        switch (fieldID) {
            case 'firstName':
                this.setState({ firstName: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'lastName':
                this.setState({ lastName: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'userName':
                this.setState({ userName: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'selectUser':
                this.setState({ userRole: sanitizeData.sanitizeWhitespace(fieldVal)});
                this.enablePasswordEdit(Event);
                break;
            case 'password':
                this.setState({ password: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'confirmPassword':
                this.setState({ confirmPassword: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'phoneNumber':
                this.setState({ phoneNumber: sanitizeData.sanitizeWhitespace(fieldVal)});
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
                <h3>Add User to Database</h3>
            </div>
            <form onSubmit={(Event) => {Event.preventDefault(); this.addUser();}}>
                <div className="modalBody">
                    <fieldset>
                        <h4 className="inputTitle">First Name</h4>
                        <input 
                            type="text" 
                            id="firstName" 
                            className={ this._returnErrorDetails("firstName") ? "invalid" : "valid"}
                            value={this.state.firstName} 
                            onChange={(Event) => this._handleChange(userValidation.validateFirstName, Event)}
                            onBlur={(Event) => this._handleBlur(userValidation.validateFirstName, Event)}
                        />
                        { this._displayErrorMessage("firstName") }
                    </fieldset>
                    <fieldset>
                        <h4 className="inputTitle">Last Name</h4>
                        <input 
                            type="text" 
                            id="lastName" 
                            className={ this._returnErrorDetails("lastName") ? "invalid" : "valid"}
                            value={this.state.lastName}
                            onChange={(Event) => this._handleChange(userValidation.validateLastName, Event)}
                            onBlur={(Event) => this._handleBlur(userValidation.validateLastName, Event)}
                        />
                        { this._displayErrorMessage("lastName") }
                    </fieldset>
                    <fieldset>
                        <h4 className="inputTitle">Username</h4>
                        <input 
                            type="text" 
                            id="userName"
                            className={ this._returnErrorDetails("userName") ? "invalid" : "valid"}
                            value={this.state.userName}
                            onChange={(Event) => this._handleChange(userValidation.validateUserName, Event)}
                            onBlur={(Event) => this._handleBlur(userValidation.validateUserName, Event)}
                        />
                        { this._displayErrorMessage("userName") }
                    </fieldset>
                    {this.state.isSignUp ? 
                        null :
                        <div>
                            <fieldset>
                                <h4 className="inputTitle">User's Role</h4>
                                <span id='userSelect'>
                                    <select 
                                        disabled={this.state.userRoleDisabled} 
                                        id='selectUser' 
                                        className={ this.returnErrorDetails('selectUser') ? 'invalid' : 'valid'}
                                        defaultValue={''}  
                                        onChange={(evt) => this.handleChange(userValidation.validateUserRole, evt)}
                                        onBlur={(evt) => this.handleBlur(userValidation.validateUserRole, evt)}>

                                        <option label='' hidden disabled ></option>
                                        <option value='user'>User</option>
                                        <option value='custodian'>Custodian</option>
                                        <option value='admin'>Admin</option>
                                    </select>
                                    <div title={roleInfo} id='roleInformation'>
                                        ?
                                    </div>
                                </span>
                                { this._displayErrorMessage("selectUser") }
                            </fieldset>
                            <fieldset>
                                <h4 className="inputTitle">Password</h4>
                                <input
                                    type="password"
                                    id="password"
                                    className={ this._returnErrorDetails("password") ? "invalid" : "valid"}
                                    disabled={this.state.pwDisabled}
                                    value={this.state.password} 
                                    onChange={(Event) => this._handleChange(userValidation.validatePassword, Event)}
                                    onBlur={(Event) => this._handleBlur(userValidation.validatePassword, Event)}
                                />
                                { this._displayErrorMessage("password") }
                            
                                <h4 className="inputTitle" hidden={this.state.pwDisabled}>Confirm Password</h4>
                                <input 
                                    type="password"
                                    id="confirmPassword"
                                    className={ this._returnErrorDetails("confirmPassword") ? "invalid" : "valid"}
                                    hidden={this.state.pwDisabled} 
                                    disabled={this.state.pwDisabled}
                                    value={this.state.confirmPassword} 
                                    onChange={(Event) => this._handleChange(userValidation.validatePasswordConfirm, Event)}
                                    onBlur={(Event) => this._handleBlur(userValidation.validatePasswordConfirm, Event)}
                                />
                                { this._displayErrorMessage("confirmPassword") }
                            </fieldset> 
                        </div>
                    }
                    <fieldset>
                        <h4 className="inputTitle">Phone Number</h4>
                        <input
                            type="text" 
                            id="phoneNumber" 
                            className={ this._returnErrorDetails("phoneNumber") ? "invalid" : "valid"}
                            value={this.state.phoneNumber}
                            onChange={(Event) => this._handleChange(userValidation.validatePhoneNumber, Event)}
                            onBlur={(Event) => this._handleBlur(userValidation.validatePhoneNumber, Event)}
                        />
                        { this._displayErrorMessage("phoneNumber") }
                    </fieldset>
                </div>
                <div className="modalFooter">
                    {this._isSumbitAvailable() ? 
                        <input type="submit" value="Submit" /> : 
                        <input type="submit" value="Submit" disabled />
                    }
                    <button type="reset" onClick={() => this._dismissModal()}>Close</button>
                </div>
            </form>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    _buildErrorDisplay(){
        return(
            <>
            <div className="modalHeader">
                <h3>Error Has Occured</h3>
            </div>
            <div className="modalBody">
                <p className="errorMesage"> {this.controllerErrorMessage} </p>
            </div>
            <div className="modalFooter">
                <button type="reset" onClick={() => this._dismissModal()}>Close</button>
            </div>
            </>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                { this.isControllerError ? this._buildErrorDisplay() : this._buildForm() }
            </Modal>
        );
    };
};