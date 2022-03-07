import React from 'react';
import {Modal} from '@fluentui/react';
import userController from '../../controllers/UserController';
import adminLogController from '../../controllers/AdminLogController';

import { validateFields } from '../InputValidation/userValidation';
import { sanitizeData } from '../InputValidation/sanitizeData';
/*
*   Modal for editing a user
*/
export default class EditUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:          props.isOpen,
            idArray:         props.idArray,
            firstName:       '',
            lastName:        '',
            userName:        '',
            password:        '',
            userRole:        '',
            phoneNumber:     '',
            error:           '',
            errorDetails:    {
                field:            '',
                errorMessage:     ''
            },
            errors:          [],
            isError:         false,
            pwDisabled:      true,
            pwRequired:      false,
            hasPassword:     false,
            resetBtn:        false,
        };
    };

    async componentDidMount(){
        let thisUser = await userController.getUserById(this.state.idArray[0]);

        //Sets the userRole select tag to the user's role
        let select = document.getElementById('selectUser');
        select.value = thisUser.userRole;

        /* Will set password reset button to show and track that 
            the user has a password already if they were originally
            a custodian or admin.*/
        if (thisUser.userRole !== 'user') {
            this.setState({ resetBtn: true, hasPassword: true });
        };

        this.setState({
            firstName:   thisUser.firstName, 
            lastName:    thisUser.lastName,
            userName:    thisUser.userName,
            userRole:    thisUser.userRole,
            phoneNumber: thisUser.phoneNumber
        });
    };

    dismissModal() {
        this.setState({ isOpen: false });
    };

    async editUser() {
        let user = {
            firstName:   this.state.firstName,
            lastName:    this.state.lastName,
            userName:    this.state.userName,
            password:    this.state.password,
            userRole:    this.state.userRole,
            phoneNumber: this.state.phoneNumber,
            hasPassword: this.state.hasPassword
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
            if ( auth.status !== undefined && auth.status >= 400 ) throw auth;
            this.setState({ error: '', isError: false });
            
            await adminLogController.createAdminLog(log);

            window.location.reload();
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ error: err.message, isError : true });
        });
    };

    handleUserRoleChange (event) {
        if (event.target.value === 'user') {
            this.setState({ 
                password: '', 
                userRole: event.target.value, 
                pwRequired: false, 
                pwDisabled: true, 
                resetBtn: false 
            });
        } else if (event.target.value !== 'user' && !this.state.hasPassword){
            this.setState({ 
                password: '', 
                userRole: event.target.value, 
                pwRequired: true, 
                pwDisabled: false, 
                resetBtn: false 
            });
        } else {
            this.setState({
                password: '', 
                userRole: event.target.value, 
                pwRequired: false, 
                pwDisabled: true, 
                resetBtn: true 
            });
        };
    };

    allowPasswordReset() {
        this.setState({
            pwDisabled: false, 
            pwRequired: true, 
            resetBtn: false
        });
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

        if(fieldID !== 'password' && validationFunc(fieldVal) && isErrorSet === false){
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
        } else if(fieldID === 'password' && validationFunc(this.state.pwRequired, fieldVal) && isErrorSet === false){
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
        if(fieldID !== 'password' && validationFunc(fieldVal)){
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
        } else{
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
            case 'userRole':
                this.setState({ userRole: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'password':
                this.setState({ password: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'phoneNumber':
                this.setState({ phoneNumber: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
                                                                                            
            default:
                break;
        }
    };

    buildForm(){
        return(
            <>
            <form onSubmit={(event) => {event.preventDefault(); this.editUser();}}>
                <div className='modalBody'>
                    {this.state.isError ? <label className='errorMessage'>{this.state.error}</label> : null}
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
                        readOnly
                        value={this.state.userName}/>
                    <h4>User's Role</h4>
                        <select id='selectUser'  onChange={(event) => this.handleUserRoleChange(event)}>
                            <option id="userOpt" value='user'>User</option>
                            <option id="custodianOpt" value='custodian'>Custodian</option>
                            <option id="adminOpt" value='admin'>Admin</option>
                        </select>
                    <h4>Password</h4>
                        <input 
                        type='password' 
                        id='password' 
                        className={ this.displayErrorMessage('password') ? 'invalid' : ''}
                        disabled={this.state.pwDisabled}
                        value={this.state.password} 
                        onChange={(evt) => this.handleChange(validateFields.validatePassword, evt)}
                        onBlur={(evt) => this.handleBlur(validateFields.validatePassword, evt)}/>
                        <span>  </span>
                        <button hidden={!this.state.resetBtn} onClick={() => this.allowPasswordReset()}>Reset</button>
                        <br></br>
                        { this.displayErrorMessage('password') }

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
                    { this.isSumbitAvailable() ? <input type='submit' value='Submit'></input> : <input type='submit' value='Submit' disabled></input>}
                    <button type="reset" onClick={() => {this.dismissModal()}}>Close</button>
                </div>
            </form>
            </>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Edit User</h3>
                </div>
                {this.buildForm()}
            </Modal>
        );
    };
};