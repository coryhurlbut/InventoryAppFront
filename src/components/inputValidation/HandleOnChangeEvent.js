/*
    Class to handle onChange and onBlur events for input field validation
*/
import React from 'react';

const EMPTY_STRING = '';
const EMPTY_LABEL = 'This is filler';

export default class HandleOnChangeEvent {
    //Expected arguments: userModal/itemModal
    constructor(args) {
        /* Handles AddItemModal/EditItemModal */
        this.itemErrorList = {
            itemNumberPrefix        : '',
            itemNumberIdentifier    : '',
            name                    : '',
            description             : '',
            serialNumber            : '',
            notes                   : '',
            homeLocation            : '',
            specificLocation        : ''
        };
        this.itemVisited = {
            itemNumberPrefix        : false,
            itemNumberIdentifier    : false,
            name                    : false,
            description             : false,
            serialNumber            : false,
            homeLocation            : false,
            specificLocation        : false
        };
        /* Handles AddUserModal/EditUserModal */
        this.userErrorList = {
            firstName           : '',
            lastName            : '',
            userName            : '',
            password            : '',
            confirmPassword     : '',
            phoneNumber         : ''
        };
        this.userVisited = {
            firstName           : false,
            lastName            : false,
            userName            : false,
            password            : true,
            confirmPassword     : true,
            phoneNumber         : false
        };
        /* Handles AddUserModal, on the condition a user is signing up */
        this.userSignUpErrorList = {
            firstName           : '',
            lastName            : '',
            userName            : '',
            phoneNumber         : ''
        };
        this.userSignupVisited = {
            firstName           : false,
            lastName            : false,
            userName            : false,
            phoneNumber         : false
        };
        //Handles isSubmitAvailable when modal is first opened
        this.isFirstOpened = true;

        //distinguish between userModals and itemModals 
        this.modalType = args;

        //Checks the return of itemValidation.js and userValidation.js
        this.handleEvent            = this._handleEvent.bind(this);
        this.handlePassword         = this._handlePassword.bind(this);
        this.handleConfirmPassword  = this._handleConfirmPassword.bind(this);
        this.handleUserRoleChange   = this._handleUserRoleChange.bind(this);

        //Controls user display of the errors
        this.setErrorMessageDisplay = this._setErrorMessageDisplay.bind(this);
        this.setClassNameIsValid    = this._setClassNameIsValid.bind(this);

        //Manages if submit should be available given the type of modal we are using
        this.isAddUserModalSubmitAvailable      = this._isAddUserModalSubmitAvailable.bind(this);
        this.isAddSignUpModalSubmitAvailable    = this._isAddSignUpModalSubmitAvailable.bind(this);
        this.isItemModalSubmitAvailable         = this._isItemModalSubmitAvailable.bind(this);
    };

    /*
    Cases to deal with:
        is there an error in the value: set error message
        is there not an error in the value: remove error -> set to empty string
    */
    _handleEvent = (Event, methodCall) => {
        const inputFieldID = Event.target.id;
        const inputFieldValue = Event.target.value;

        //Are we in the UserModal or ItemModals?
        if(this.modalType === 'userModalAdd' || this.modalType === 'userModalEdit') {
            //Validate the value of the inputFields against given validation
            if(!methodCall(inputFieldValue)){
                this.userErrorList[inputFieldID] = EMPTY_STRING;
            } else {
                this.userErrorList[inputFieldID] = methodCall(inputFieldValue);
            }
            this.userVisited[inputFieldID] = true;
        } else if(this.modalType === 'userModalAddSignUp') {
            if(!methodCall(inputFieldValue)){
                this.userSignUpErrorList[inputFieldID] = EMPTY_STRING;
            } else {
                this.userSignUpErrorList[inputFieldID] = methodCall(inputFieldValue);
            }
            this.userSignupVisited[inputFieldID] = true;
        } else {
            //Validate the value of the inputFields against given validation
            if(!methodCall(inputFieldValue)){
                this.itemErrorList[inputFieldID] = EMPTY_STRING;
            } else {
                this.itemErrorList[inputFieldID] = methodCall(inputFieldValue);
            }
            this.itemVisited[inputFieldID] = true;
        }
        this.isFirstOpened = false;
    };
    /* Special Case */
    _handleConfirmPassword = (userPassword, confirmPassword, methodCall) => {
        if(!methodCall(userPassword, confirmPassword)) {
            this.userErrorList['confirmPassword'] = EMPTY_STRING;
        } else {
            this.userErrorList['confirmPassword'] = methodCall(userPassword, confirmPassword);
        }
        this.userVisited['confirmPassword'] = true;
    }
    /* Special Case */
    _handlePassword = (isRequired, password, methodCall) => {
        if(!methodCall(isRequired, password)) {
            this.userErrorList['password'] = EMPTY_STRING;
        } else {
            this.userErrorList['password'] = methodCall(isRequired, password);
        }
        this.userVisited['password'] = true;
    }

    /* If password and confirm password are not needed, remove error messages */
    _handleUserRoleChange = (userRoleSelected) => {
        if(userRoleSelected === 'user') {
            this.userErrorList['confirmPassword']   = EMPTY_STRING;
            this.userErrorList['password']          = EMPTY_STRING;
            this.userVisited['confirmPassword']     = true;
            this.userVisited['password']            = true;
        }
        else {
            this.userVisited['confirmPassword'] = false;
            this.userVisited['password']        = false;
        }
    }

    /* Handles special case of password and confirm password */
    _setErrorMessageDisplay = (inputFieldID, isDisabled = false) => {
        if(this.modalType === 'userModalAdd' || this.modalType === 'userModalEdit') {
            if(this.userErrorList[inputFieldID] !== EMPTY_STRING) {
                return(
                    <label className="errorMessage">
                        {this.userErrorList[inputFieldID]}
                    </label>
                );
            }
            return(
                <label className="emptyLabel">
                   {EMPTY_LABEL}
                </label>
            );
        }  else if(this.modalType === 'userModalAddSignUp') {
            if(this.userSignUpErrorList[inputFieldID] !== EMPTY_STRING) {
                return(
                    <label className="errorMessage">
                        {this.userSignUpErrorList[inputFieldID]}
                    </label>
                );
            }
            return(
                <label className="emptyLabel">
                    {EMPTY_LABEL}
                </label>
            );
        } else {
            if(this.itemErrorList[inputFieldID] !== EMPTY_STRING) {
                return(
                    <label className="errorMessage">
                        {this.itemErrorList[inputFieldID]}
                    </label>
                );
            }
            return(
                <label className="emptyLabel">
                    {EMPTY_LABEL}
                </label>
            );
        }
    };
    /* Classname -> valid if true / invalid if false */
    _setClassNameIsValid = (inputFieldID) => {
        if(this.modalType === 'userModalAdd' || this.modalType === 'userModalEdit') {
            if(this.userErrorList[inputFieldID] === EMPTY_STRING) {
                return true;
            }
            return false;
        } else if(this.modalType === 'userModalAddSignUp') {
            if(this.userSignUpErrorList[inputFieldID] === EMPTY_STRING) {
                return true;
            }
            return false;
        } else {
            if(this.itemErrorList[inputFieldID] === EMPTY_STRING) {
                return true;
            }
            return false;
        }
    }

    /* Each of the SubmitAvailable methods conditions depending on which modal is trying to submit
     *  Add modals need an errorMessage check as well check to ensure each field has been touched.
     *  Edit modals, since they already have data, just need an errorMesage check
     */

    /* submit button disabled -> false / submit button enabled -> true */
    _isItemModalSubmitAvailable = (oldItem, newItem) => {
        if(this.isFirstOpened){
            return false;
        } else {
            let errorList = this.itemErrorList;
            let isVisitedList = this.itemVisited;

            if(this.modalType === 'itemModalEdit') {
                if(JSON.stringify(oldItem) === JSON.stringify(newItem)){
                    
                    return false;
                }
                //Prefix and Identifier aren't fields in EditItemModal, only AddItemModal
                for(let errorItem in errorList) {
                    if(errorItem !== 'itemNumberPrefix' && errorItem !== 'itemNumberIdentifier' && errorList[errorItem] !== EMPTY_STRING ) {
                        return false;
                    }
                }
                return true;
            } else {
                //Checks for Error Messages
                for(let errorItem in errorList) {
                    if(errorList[errorItem] !== EMPTY_STRING) {
                        return false;
                    }
                }
                //Checks if each field has been touched to submit
                for(let inputField in isVisitedList) {
                    if(!isVisitedList[inputField]) {
                        return false;
                    }
                }
                return true;
            }
        }
    }
    /* submit button disabled -> false / submit button enabled -> true */
    _isAddUserModalSubmitAvailable = (oldUser, newUser) => {
        if(this.isFirstOpened) {
            return false;
        } else {
            let errorList = this.userErrorList;
            let isVisitedList = this.userVisited;
            console.log(newUser.password)
            if(this.modalType === 'userModalAdd') {
                
                //Checks to makes sure each field is touched to submit
                for(let inputField in isVisitedList) {
                    if(!isVisitedList[inputField]) {
                        return false;
                    }
                }
            } else {
                if(JSON.stringify(oldUser) === JSON.stringify(newUser) || 
                   newUser.password !== newUser.confirmPassword){
                    return false;
                }
            }
            //Checks if any errors exist, if so, don't submit
            for(let errorItem in errorList) {
                if(errorList[errorItem] !== EMPTY_STRING) {
                    return false;
                }
            }
            return true;
        }
    }
    /* submit button disabled -> false / submit button enabled -> true */
    _isAddSignUpModalSubmitAvailable = () => {
        if(this.isFirstOpened) {
            return false;
        } else {
            let errorList = this.userSignUpErrorList;
            let isVisitedList = this.userSignupVisited;

            //Checks if any errors exist, if so, don't submit
            for(let errorItem in errorList) {
                if(errorList[errorItem] !== EMPTY_STRING) {
                    return false;
                }
            }
            //Checks to makes sure each field is touched to submit
            for(let inputField in isVisitedList) {
                if(!isVisitedList[inputField]) {
                    return false;
                }
            }
            return true;
        }
    }
};