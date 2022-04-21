/*
    Class to handle onChange and onBlur events for input field validation

    Houses the error messages
    should submit be available

    Methods:
    _displayErrorMessage()
    _handleRemoveError()
    _returnErrorDetails()
    _isSubmitAvailable
    _handleChangeAndBlur()
*/
import React from 'react';

/*
    state variables: error messages
        handled by the component
        mutable
    prop variables: fieldIDs 
        data is managed by parent components (ItemModals, UserModals, ...)
        immutable
*/
const EMPTY_STRING = '';
export default class HandleOnChangeEvent {
    //Expected arguments: userModal/itemModal
    constructor(args) {
        this.itemErrorList = {
            itemNumberPrefix:     '',
            itemNumberIdentifier: '',
            name:                 '',
            description:          '',
            serialNumber:         '',
            notes:                '',
            homeLocation:         '',
            specificLocation:     ''
        };

        this.userErrorList = {
            firstName:       '',
            lastName:        '',
            userName:        '',
            password:        '',
            userRole:        '',
            status:          '',
            userPassword:    '',
            confirmPassword: '',
            phoneNumber:     ''
        };
        
        this.isFirstOpened = true;

        this.modalType = args;

        this.handleEvent = this._handleEvent.bind(this);
        this.handlePassword = this._handlePassword.bind(this);
        this.handleConfirmPassword = this._handleConfirmPassword.bind(this);

        this.setErrorMessageDisplay = this._setErrorMessageDisplay.bind(this);
        this.setClassNameIsValid = this._setClassNameIsValid.bind(this);

        this.isAddUserModalSubmitAvailable = this._isAddUserModalSubmitAvailable.bind(this);
        this.isAddSignUpModalSubmitAvailable = this._isAddSignUpModalSubmitAvailable.bind(this);
        this.isItemModalSubmitAvailable = this._isItemModalSubmitAvailable.bind(this);
    };

    /*
    Cases to deal with:
        is there an error in the value: set error message
        is there not an error in the value: remove error
    */
    _handleEvent = (Event, methodCall) => {
        const inputFieldID = Event.target.id;
        const inputFieldValue = Event.target.value;

        //Are we in the UserModal or ItemModals?
        if(this.modalType === 'userModal') {
            //Validate the value of the inputFields against given validation
            if(!methodCall(inputFieldValue)){
                this.userErrorList[inputFieldID] = EMPTY_STRING;
            } else {
                this.userErrorList[inputFieldID] = methodCall(inputFieldValue);
            }
        } else {
            //Validate the value of the inputFields against given validation
            if(!methodCall(inputFieldValue)){
                this.itemErrorList[inputFieldID] = EMPTY_STRING;
            } else {
                this.itemErrorList[inputFieldID] = methodCall(inputFieldValue);
            }
        }
        this.isFirstOpened = false;
    };

    _handleConfirmPassword = (userPassword, confirmPassword, methodCall) => {
        if(!methodCall(userPassword, confirmPassword)) {
            this.userErrorList['confirmPassword'] = EMPTY_STRING;
        } else {
            this.userErrorList['confirmPassword'] = methodCall(userPassword, confirmPassword);
        }
    }

    _handlePassword = (isRequired, password, methodCall) => {
        if(!methodCall(isRequired, password)) {
            this.userErrorList['password'] = EMPTY_STRING;
        } else {
            this.userErrorList['password'] = methodCall(isRequired, password);
        }
    }

    /*  */
    _setErrorMessageDisplay = (inputFieldID, isDisabled = false) => {
        if(this.modalType === 'userModal') {
            if((inputFieldID === 'password' && 
                this.userErrorList[inputFieldID] !== EMPTY_STRING) || 
                (inputFieldID === 'confirmPassword' && 
                this.userErrorList[inputFieldID] !==  EMPTY_STRING)
            ) {
                return(
                    <label className="errorMessage" hidden={isDisabled}>
                        {this.userErrorList[inputFieldID]}
                    </label>
                );
            } else if(this.userErrorList[inputFieldID] !== EMPTY_STRING) {
                return(
                    <label className="errorMessage">
                        {this.userErrorList[inputFieldID]}
                    </label>
                );
            }
            return(
                <label className="emptyLabel">
                    This is filler
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
                    This is filler
                </label>
            );
        }
    };

    _setClassNameIsValid = (inputFieldID) => {
        if(this.modalType === 'userModal') {
            if(this.userErrorList[inputFieldID] === EMPTY_STRING) {
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

    _isItemModalSubmitAvailable = () => {
        if(this.isFirstOpened){
            return false;
        } else {
            let errorList = this.itemErrorList;
        
            if(this.modalType === 'editItemModal') {
                for(let errorItem in errorList) {
                    if(errorItem !== 'itemNumberPrefix' && errorItem !== 'itemNumberIdentifier' && errorList[errorItem] !== EMPTY_STRING) {
                        return false;
                    }
                }
                return true;
            } else {
                for(let errorItem in errorList) {
                    if(errorList[errorItem] !== EMPTY_STRING) {
                        return false;
                    }
                }
                return true;
            }
        }
    }

    _isAddUserModalSubmitAvailable = () => {
        if(this.isFirstOpened) {
            return false;
        } else {
            let errorList = this.userErrorList;

            for(let errorItem in errorList) {
                if(errorList[errorItem] !== EMPTY_STRING) {
                    return false;
                }
            }
            return true;
        }
    }

    _isAddSignUpModalSubmitAvailable = () => {
        if(this.isFirstOpened) {
            return false;
        } else {
            let errorList = this.userErrorList;

        for(let errorItem in errorList) {
            if(errorItem === 'firstName' || 
                errorItem === 'lastName' || 
                errorItem === 'userName' || 
                errorItem === 'phoneNumber'
            ) {
                if(errorList[errorItem] !== EMPTY_STRING) {
                    return false;
                }
            }
        }
        return true;
        }
    }

};

