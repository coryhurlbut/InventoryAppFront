import React              from 'react';
import {Modal}            from '@fluentui/react';
import {authController}   from '../../controllers/AuthController'
import userController     from '../../controllers/UserController';
import adminLogController from '../../controllers/AdminLogController';

import { validateFields } from '../InputValidation/userValidation';
import { sanitizeData }   from '../InputValidation/sanitizeData';

/*
*   Modal for adding a user
*/
export default class AddUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:          props.isOpen,
            firstName:       '',
            lastName:        '',
            userName:        '',
            password:        '',
            confirmPassword: '',
            userRole:        '',
            phoneNumber:     '',
            pwDisabled:      true,
            pwRequired:      false,
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

    /* When a custodian is logged in, 
        allow only the ability to add user roles */
    async componentDidMount(){
        try {
            let signedInAccount = await authController.getUserInfo();

            if(signedInAccount.user.user.userRole === 'custodian'){
                //Front end display so it show's user is selected
                let select = document.getElementById('selectUser');
                select.value = 'user';

                //Backend functionality of setting the role to a user
                this.setState({ userRoleDisabled: true,
                                userRole: 'user'});
            }
        } catch (error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ isControllerError: true,
                            controllerErrorMessage: "An error occured while loading. Please refresh and try again."});
        }
        
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async addUser(){
        let user = {
            firstName:      this.state.firstName,
            lastName:       this.state.lastName,
            userName:       this.state.userName,
            password:       this.state.password,
            userRole:       this.state.userRole,
            phoneNumber:    sanitizeData.sanitizePhoneNumber(this.state.phoneNumber),
        };

        let returnedUser = {};
        await userController.createUser(user)
        .then((data) => {
            if (data.status !== undefined && data.status >= 400) throw data;
            
            this.setState({ isControllerError: false, 
                            controllerErrorMessage: ''});
            returnedUser = data;

            window.location.reload();
            this.dismissModal();
        })
        .catch( async (err) => {  
            this.setState({ isControllerError: true, 
                            controllerErrorMessage: err.message});          
        });

        let log = {
            itemId:     'N/A',
            userId:     returnedUser._id,
            adminId:    '',
            action:     'add',
            content:    'user'
        };
        await adminLogController.createAdminLog(log);
    };

    enablePasswordEdit(event) {
        if (event.target.value === 'user') {
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
            this.handleRemoveError('password');
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
    displayErrorMessage(fieldID){
        let errorDetail = this.returnErrorDetails(fieldID);

        if(errorDetail){
            return(
                <label className='errorMessage'> { errorDetail.errorMessage} </label>
            );
        }
        return null;
    };

    /* When an errorDetail is no longer present, remove from errors list */
    handleRemoveError(fieldID){
        const updatedErrors = this.state.errors.filter(errorDetails => errorDetails.field !== fieldID);
        this.setState({ errors: updatedErrors});
    };
    
    /* Loops through the errors list
        returns the errorDetail or false if it doesn't exists */
    returnErrorDetails(fieldID){
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
        if(validateFields.validateSubmit(this.state.firstName, this.state.lastName, this.state.userName, this.state.userRole, this.state.phoneNumber, this.state.pwRequired, this.state.password) && this.state.errors.length == 0){
            return true;
        }
        return false;
    };

    /* Primary purpose:
        indicate to user that field is required when user clicks off field without entering any information
        isEmpty in userValidation is triggered and error is returned for display */
    handleBlur(validationFunc, evt) {
        const fieldID = evt.target.id;
        const fieldVal = evt.target.value;
        const isErrorSet = this.returnErrorDetails(fieldID);

        if(fieldID === 'password' && validationFunc(this.state.pwRequired, fieldVal) && isErrorSet === false){
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
        } else if(fieldID === 'confirmPassword' && validationFunc(this.state.password, fieldVal) && isErrorSet === false){
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
        } else if(fieldID !== 'password' && fieldID !== 'confirmPassword' && validationFunc(fieldVal) && isErrorSet === false){
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
    handleChange(validationFunc, evt) {
        const fieldID = evt.target.id;
        const fieldVal = evt.target.value;

        /* If something is returned from this function, an error occured 
            since an error was returned, set the error state
        */
        if(fieldID === 'confirmPassword' && validationFunc(this.state.password, fieldVal)){
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
        } else if(fieldID === 'password' && validationFunc(this.state.pwRequired, fieldVal)){
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
        } else if(fieldID !== 'password' && fieldID !== 'confirmPassword' && validationFunc(fieldVal)){
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
        } else {
            this.setState( prevState => ({
                errorDetails: {
                    ...prevState.errorDetails,
                    field:        '',
                    errorMessage: ''
                }
            }));
            this.handleRemoveError(fieldID);
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
                this.enablePasswordEdit(evt);
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
    buildForm(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Add User to Database</h3>
            </div>
            <form onSubmit={(Event) => {Event.preventDefault(); this.addUser();}}>
                <div className='modalBody'>
                    <h4>First Name</h4>
                        <input 
                        type='text' 
                        id='firstName' 
                        className={ this.displayErrorMessage('firstName') ? 'invalid' : ''}
                        value={this.state.firstName} 
                        onChange={(evt) => this.handleChange(validateFields.validateFirstName, evt)}
                        onBlur={(evt) => this.handleBlur(validateFields.validateFirstName, evt)}/>
                        <br></br>
                        { this.displayErrorMessage('firstName') }

                    <h4>Last Name</h4>
                        <input 
                        type='text' 
                        id='lastName' 
                        className={ this.displayErrorMessage('lastName') ? 'invalid' : ''}
                        value={this.state.lastName}
                        onChange={(evt) => this.handleChange(validateFields.validateLastName, evt)}
                        onBlur={(evt) => this.handleBlur(validateFields.validateLastName, evt)}/>
                        <br></br>
                        { this.displayErrorMessage('lastName') }

                    <h4>Username</h4>
                        <input 
                        type='text' 
                        id='userName' 
                        className={ this.displayErrorMessage('userName') ? 'invalid' : ''}
                        value={this.state.userName}
                        onChange={(evt) => this.handleChange(validateFields.validateUserName, evt)}
                        onBlur={(evt) => this.handleBlur(validateFields.validateUserName, evt)}/>
                        <br></br>
                        { this.displayErrorMessage('userName') }
                    
                    <h4>User's Role</h4>
                        <select 
                            disabled={this.state.userRoleDisabled} 
                            id='selectUser' 
                            defaultValue={''}  
                            onChange={(evt) => this.handleChange(validateFields.validateUserRole, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateUserRole, evt)}>

                            <option label='' hidden disabled ></option>
                            <option value='user'>User</option>
                            <option value='custodian'>Custodian</option>
                            <option value='admin'>Admin</option>
                        </select>
                        <br></br>
                        { this.displayErrorMessage('selectUser') }

                    <h4>Password</h4>
                        <input
                        type='password'
                        id='password'
                        className={ this.displayErrorMessage('password') ? 'invalid' : ''}
                        disabled={this.state.pwDisabled}
                        value={this.state.password} 
                        onChange={(evt) => this.handleChange(validateFields.validatePassword, evt)}
                        onBlur={(evt) => this.handleBlur(validateFields.validatePassword, evt)}/>
                        <br></br>
                        { this.displayErrorMessage('password') }
                    
                    <h4 hidden={this.state.pwDisabled}>Confirm Password</h4>
                        <input 
                        type='password' 
                        id='confirmPassword' 
                        className={ this.displayErrorMessage('confirmPassword') ? 'invalid' : ''}
                        hidden={this.state.pwDisabled}
                        value={this.state.confirmPassword} 
                        onChange={(evt) => this.handleChange(validateFields.validatePasswordConfirm, evt)}
                        onBlur={(evt) => this.handleBlur(validateFields.validatePasswordConfirm, evt)}/>
                        <br hidden={this.state.pwDisabled}></br>
                        { this.displayErrorMessage('confirmPassword') }
                    
                    <h4>Phone Number</h4>
                        <input
                        type='text' 
                        id='phoneNumber' 
                        className={ this.displayErrorMessage('phoneNumber') ? 'invalid' : ''}
                        value={this.state.phoneNumber}
                        onChange={(evt) => this.handleChange(validateFields.validatePhoneNumber, evt)}
                        onBlur={(evt) => this.handleBlur(validateFields.validatePhoneNumber, evt)}/>
                        <br></br>
                        { this.displayErrorMessage('phoneNumber') }
                    
                </div>
                <div className='modalFooter'>
                    {this.isSumbitAvailable() ? <input type='submit' value='Submit'></input> : <input type='submit' value='Submit' disabled></input>}
                    <button type="reset" onClick={() => this.dismissModal()}>Close</button>
                </div>
            </form>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    buildErrorDisplay(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Error Has Occured</h3>
            </div>
            <div className='modalBody'>
                <p className='errorMesage'> {this.controllerErrorMessage} </p>
            </div>
            <div className='modalFooter'>
                <button type="reset" onClick={() => this.dismissModal()}>Close</button>
            </div>
            </>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                { this.isControllerError ? this.buildErrorDisplay() : this.buildForm() }
            </Modal>
        );
    };
};