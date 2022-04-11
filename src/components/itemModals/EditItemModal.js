import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    adminLogController }    from '../../controllers';
import { itemValidation,
    sanitizeData }          from '../inputValidation';

/*
*   Modal for editing an item
*/
export default class EditItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:           props.isOpen,
            name:             '',
            description:      '',
            serialNumber:     '',
            notes:            '',
            homeLocation:     '',
            specificLocation: '',
            available:        true,
            errorDetails:     {
                field:            '',
                errorMessage:     ''
            },
            errors:                 [],
            isControllerError:      false,
            controllerErrorMessage: ''
        };

        this._idArray = props.idArray;
        this._selectedObjects = props.selectedObjects;
    }

    async componentDidMount() {
        try {
            let thisItem = await itemController.getItemById(this._idArray[0]);

            this.setState({
                name:             thisItem.name,
                description:      thisItem.description,
                serialNumber:     thisItem.serialNumber,
                notes:            thisItem.notes,
                homeLocation:     thisItem.homeLocation,
                specificLocation: thisItem.specificLocation,
                available:        thisItem.available
            });
        } catch(error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({
                isControllerError: true,
                controllerErrorMessage: "An error occured while loading. Please refresh and try again."
            });
        }
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _editItem = async () => {
        let item = {
            name:               this.state.name,
            description:        this.state.description,
            serialNumber:       this.state.serialNumber,
            notes:              this.state.notes,
            homeLocation:       this.state.homeLocation,
            specificLocation:   this.state.specificLocation,
            available:          this.state.available
        };
        
        let log = {
            itemId:     this._idArray[0],
            userId:     'N/A',
            adminId:    '',
            action:     'edit',
            content:    'item'
        };

        await itemController.updateItem(this._idArray[0], item)
        .then(async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ 
                isControllerError: false, 
                controllerErrorMessage: ''
            });
            
            await adminLogController.createAdminLog(log);

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ 
                isControllerError: true, 
                controllerErrorMessage: err.message
            });
        });
    }

    /* For the given field, identified by fieldID
        determine is errors has an assoicated error message to display */
    _displayErrorMessage = (fieldID) => {
        let errorDetail = this._returnErrorDetails(fieldID);

        if(errorDetail) {
            return(
                <label className="errorMessage"> 
                    {errorDetail.errorMessage} 
                </label>
            );
        };

        return <label className="emptyLabel">This is filler</label>;
    }

    /* When an errorDetail is no longer present, remove from errors list */
    _handleRemoveError = (fieldID) => {
        const updatedErrors = this.state.errors.filter((errorDetails) => {return errorDetails.field !== fieldID});
        this.setState({ errors: updatedErrors });
    }
    
    /* Loops through the errors list
        returns the errorDetail or false if it doesn't exists */
    _returnErrorDetails = (fieldID) => {
        let errorList = this.state.errors;

        if(errorList) {
            for(let index = 0; index < errorList.length; index++) {
                if(errorList[index].field === fieldID) {
                    return errorList[index];
                };
            };
        };
        return false;
    }

    /* Useability Feature:
        submit button is only enabled when no errors are detected */
    _isSubmitAvailable = () => {
        if(itemValidation.validateSubmit(
            this.state.name, 
            this.state.description, 
            this.state.homeLocation, 
            this.state.specificLocation, 
            this.state.serialNumber
            ) && this.state.errors.length === 0
        ) {
            return true;
        }

        return false;
    }

    /* Primary purpose:
        indicate to user that field is required when user clicks off field without entering any information
        isEmpty in userValidation is triggered and error is returned for display */
    _handleBlur = (validationFunc, evt) => {
        const fieldID       = evt.target.id;
        const fieldVal      = evt.target.value;
        const isErrorSet    = this._returnErrorDetails(fieldID);

        if(validationFunc(fieldVal) && isErrorSet === false) {
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
                isError:          true,
                errors: [
                    ...prevState.errors,
                    errorDetail
                ]
            }));
        };

        return;
    };

    /* Provide user immediate field requirement:
        check if user is producing errors -> validateOnChange is true
        updates the value of the state for that field */
    _handleChange = (validationFunc, evt) => {
        const fieldID  = evt.target.id;
        const fieldVal = evt.target.value;

        /* If something is returned from this function, an error occured 
            since an error was returned, set the error state
        */
        if(!this._returnErrorDetails(fieldID) && validationFunc(fieldVal)) {   //Does the error already exist? no
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
        } else if(!validationFunc(fieldVal)) {
            this.setState( prevState => ({
                errorDetails: {
                    ...prevState.errorDetails,
                    field:        '',
                    errorMessage: ''
                }
            }));
            this._handleRemoveError(fieldID);
        };

        //Update the state for whatever field is being modified
        switch(fieldID) {
            case 'name':
                this.setState({ name: sanitizeData.sanitizeWhitespace(fieldVal) });
                break;
            case 'description':
                this.setState({ description: sanitizeData.sanitizeWhitespace(fieldVal) });
                break;
            case 'serialNumber':
                this.setState({ serialNumber: sanitizeData.sanitizeWhitespace(fieldVal) });
                break;
            case 'notes':
                this.setState({ notes: sanitizeData.sanitizeWhitespace(fieldVal) });
                break;
            case 'homeLocation':
                this.setState({ homeLocation: sanitizeData.sanitizeWhitespace(fieldVal) });
                break;
            case 'specificLocation':
                this.setState({ specificLocation: sanitizeData.sanitizeWhitespace(fieldVal) });
                break;
            default:
                break;
        };
    }
    
    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._editItem();
    }

    /* Builds user input form */
    _buildForm = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Edit Item</h3>
                </div>
                <form onSubmit={this._handleFormSubmit}>
                    <div className="modalBody">
                        <fieldset>
                            <h4 className="inputTitle">Name</h4>
                            <input 
                                type="text" 
                                id="name"
                                className={this._returnErrorDetails("name") ? "invalid" : "valid"}
                                value={this.state.name} 
                                onChange={(evt) => this._handleChange(itemValidation.validateName, evt)}
                                onBlur={(evt) => this._handleBlur(itemValidation.validateName, evt)}
                            />
                            {this._displayErrorMessage("name")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Description</h4>
                            <input 
                                type="text" 
                                id="description" 
                                className={ this._returnErrorDetails("description") ? "invalid" : "valid"}
                                value={this.state.description}
                                onChange={(evt) => this._handleChange(itemValidation.validateDescription, evt)}
                                onBlur={(evt) => this._handleBlur(itemValidation.validateDescription, evt)}
                            />
                            {this._displayErrorMessage("description")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Serial Number</h4>
                            <input 
                                type="text" 
                                id="serialNumber" 
                                className={ this._returnErrorDetails("serialNumber") ? "invalid" : "valid"}
                                value={this.state.serialNumber} 
                                onChange={(evt) => this._handleChange(itemValidation.validateSerialNumber, evt)}
                                onBlur={(evt) => this._handleBlur(itemValidation.validateSerialNumber, evt)}
                            />
                            {this._displayErrorMessage("serialNumber")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Notes</h4>
                            <input 
                                type="text" 
                                id="notes" 
                                className={ this._returnErrorDetails("notes") ? "invalid" : "valid"}
                                value={this.state.notes} 
                                onChange={(evt) => this._handleChange(itemValidation.validateNotes, evt)}
                                onBlur={(evt) => this._handleBlur(itemValidation.validateNotes, evt)}
                            />
                            {this._displayErrorMessage("notes")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Home Location</h4>
                            <input 
                                type="text" 
                                id="homeLocation" 
                                className={ this._returnErrorDetails("homeLocation") ? "invalid" : "valid"}
                                value={this.state.homeLocation} 
                                onChange={(evt) => this._handleChange(itemValidation.validateLocation, evt)}
                                onBlur={(evt) => this._handleBlur(itemValidation.validateLocation, evt)}
                            />
                            {this._displayErrorMessage("homeLocation")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Specific Location</h4>
                            <input 
                                type="text" 
                                id="specificLocation" 
                                className={ this._returnErrorDetails("specificLocation") ? "invalid" : "valid"}
                                value={this.state.specificLocation} 
                                onChange={(evt) => this._handleChange(itemValidation.validateSpecificLocation, evt)}
                                onBlur={(evt) => this._handleBlur(itemValidation.validateSpecificLocation, evt)} 
                            />
                            {this._displayErrorMessage("specificLocation")}
                        </fieldset>
                    </div>
                    <div className="modalFooter">
                        <input type='submit' value='Submit' disabled={!this._isSubmitAvailable()} />
                        <button type="reset" onClick={this._dismissModal}>Close</button>
                    </div>
                </form>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    _buildErrorDisplay = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Error Has Occured</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">{this.controllerErrorMessage}</p>
                </div>
                <div className="modalFooter">
                    <button type="reset" onClick={this._dismissModal}>
                        Close
                    </button>
                </div>
            </>
        );
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this.isControllerError ? this._buildErrorDisplay() : this._buildForm()}
            </Modal>
        );
    }
}