import React from 'react';

const EMPTY_STRING = '';
const EMPTY_LABEL = 'This is filler';

/*
    Class to handle onChange and onBlur events for input field validation in 
    both user and item modals
        -Tracks which input field has an error
        -Tracks when submit should and should not be available
        -Has additional special case for userModal isSignup is true
*/
export default class HandleOnChangeEvent {
    /*
        Expected arguments: 
            -userModalAdd/userModalEdit/userModalAddSignUp
            -itemModalAdd/itemModalEdit
    */
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

    /*  Arguments:
            Event of the onchange or onblur
            input validation method needed for the input field that triggered the event
        Cases to deal with:
            -is there an error in the value: set error message
            -is there not an error in the value: remove error -> set to empty string
        Returns:
            nothing, tracks the error messages and other functions return to the user
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
    };
    /* Special Case - handling password options */
    _handleConfirmPassword = (userPassword, confirmPassword, methodCall) => {
        if(!methodCall(userPassword, confirmPassword)) {
            this.userErrorList['confirmPassword'] = EMPTY_STRING;
        } else {
            this.userErrorList['confirmPassword'] = methodCall(userPassword, confirmPassword);
        }
        this.userVisited['confirmPassword'] = true;
    }
    /* Special Case - handling password options */
    _handlePassword = (isRequired, password, methodCall) => {
        if(!methodCall(isRequired, password)) {
            this.userErrorList['password'] = EMPTY_STRING;
        } else {
            this.userErrorList['password'] = methodCall(isRequired, password);
        }
        this.userVisited['password'] = true;
    }

    /* 
        Special Case - handling password options
            If password and confirm password are not needed, remove error messages 
    */
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

    /* 
        Controls the error output for isSignup true/false/ and itemModals

        Returns:
            specific input field's error message
            an empty label that is hidden to prevent unnecessary changing of modal size
    */
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
    /*
        The input fields the users can interact with have two possible values to determining CSS styling
        These values are determined if an error message is associated with the input field
        
        Returns:
            true - valid className will be assigned in modal
            false - invalid className will be assigned in modal
    */
    _setClassNameIsValid = (inputFieldID) => {
        if(this.modalType === 'userModalAdd' || this.modalType === 'userModalEdit') {
            return (this.userErrorList[inputFieldID] === EMPTY_STRING);
        } else if(this.modalType === 'userModalAddSignUp') {
            return (this.userSignUpErrorList[inputFieldID] === EMPTY_STRING);
        } else {
            return (this.itemErrorList[inputFieldID] === EMPTY_STRING);
        }
    }

    /* Each of the SubmitAvailable methods conditions depending on which modal is trying to submit
     *  Add modals need an errorMessage check as well check to ensure each field has been touched.
     *  Edit modals, since they already have data, just need an errorMesage check
     */

    /* 
        Determines if the user has inputed any errors/visited all the fields

        Returns:
            false - submit button disabled
            true - submit button available 
    */
    _isItemModalSubmitAvailable = (oldItem, newItem) => {
        let errorList = this.itemErrorList;
        let isVisitedList = this.itemVisited;

        if(this.modalType === 'itemModalEdit') {
            //Checks if the user has made any modification to the previous values
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
    /* 
        Determines if the user has inputed any errors/visited all the fields

        Returns:
            false - submit button disabled
            true - submit button available 
    */
    _isAddUserModalSubmitAvailable = (oldUser, newUser) => {
        let errorList = this.userErrorList;
        let isVisitedList = this.userVisited;

        if(this.modalType === 'userModalAdd') {
            //Checks to makes sure each field is touched to submit
            for(let inputField in isVisitedList) {
                if(!isVisitedList[inputField]) {
                    return false;
                }
            }
        } else { //userModalEdit
            //Checks if the user has made any modification to the previous values
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
    /* 
        Determines if the user has inputed any errors/visited all the fields

        Returns:
            false - submit button disabled
            true - submit button available 
    */
    _isAddSignUpModalSubmitAvailable = () => {
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
};