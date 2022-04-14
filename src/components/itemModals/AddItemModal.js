import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    adminLogController }    from '../../controllers';
import { itemValidation,
    sanitizeData }          from '../inputValidation';

/*
*   Modal for adding an item
*/
export default class AddItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:                 props.isOpen,
            itemNumber:             'AAA-AAAAA',
            itemNumberPrefix:       '',
            itemNumberIdentifier:   '',
            name:                   '',
            description:            '',
            serialNumber:           '',
            notes:                  '',
            homeLocation:           '',
            specificLocation:       '',
            available:              true,
            disabled:               true,
            
            errors:                 [],
            isControllerError:      false,
            controllerErrorMessage: ''
        };
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _addItem = async () => {
        let d = Date.now();
        let now = new Date(d);
        let now1 = now.toISOString();

        let newNotes = (`${this.state.notes + '`' + now1 + '`'}`);
        //Makes call to add item to database and grabs the _id of the newly created item
        let item = {
            itemNumber:         this.state.itemNumber,
            name:               this.state.name,
            description:        this.state.description,
            serialNumber:       this.state.serialNumber,
            notes:              newNotes,
            homeLocation:       this.state.homeLocation,
            specificLocation:   this.state.specificLocation,
            available:          this.state.available
        };
        let returnedItem = {};

        await itemController.createItem(item)
        .then((data) => {
            if(data.status !== undefined && data.status >= 400) throw data;
            
            this.setState({ 
                isControllerError: false, 
                controllerErrorMessage: '' 
            });
            returnedItem = data;
            window.location.reload();
            this._dismissModal();
        })
        .catch( async (err) => {            
            this.setState({ 
                isControllerError: true, 
                controllerErrorMessage: err.message 
            }); 
        });

        //Uses the new item _id to make a log to the admin log of the new item being added
        let log = {
            itemId:     returnedItem.itemNumber,
            userId:     'N/A',
            adminId:    '',
            action:     'add',
            content:    'item'
        };

        //TODO: add error handling for log API calls
        await adminLogController.createAdminLog(log);
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
            this.state.itemNumberPrefix,
            this.state.itemNumberIdentifier,
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
    _handleBlur = (validationFunc, Event) => {
        const fieldID       = Event.target.id;
        const fieldVal      = Event.target.value;
        const isErrorSet    = this._returnErrorDetails(fieldID);

        if(validationFunc(fieldVal) && isErrorSet === false) {
            //To update the list of error, we need an object preset with the inform, as we can't collect from setState errorDetails
            let errorDetail = {
                field:        fieldID,
                errorMessage: validationFunc(fieldVal)
            };

            this.setState( prevState => ({
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
    _handleChange = (validationFunc, Event) => {
        const fieldID  = Event.target.id;
        const fieldVal = Event.target.value;

        /* If something is returned from this function, an error occured 
            since an error was returned, set the error state
        */
        if(!this._returnErrorDetails(fieldID) && validationFunc(fieldVal)) {   //Does the error already exist? no
            let errorDetail = {
                field:        fieldID,
                errorMessage: validationFunc(fieldVal)
            };

            this.setState( prevState => ({
                errors: [
                    ...prevState.errors,
                    errorDetail
                ]
            }));
        } else if(!validationFunc(fieldVal)) {
            this._handleRemoveError(fieldID);
        };

        //Update the state for whatever field is being modified
        switch(fieldID) {
            case 'itemNumberPrefix':
                this.setState({ 
                    itemNumberPrefix: sanitizeData.sanitizeWhitespace(fieldVal),
                    itemNumber: this._createItemNumber(Event)
                });
                break;
            case 'itemNumberIdentifier':
                this.setState({ 
                    itemNumberIdentifier: sanitizeData.sanitizeWhitespace(fieldVal),
                    itemNumber: this._createItemNumber(Event)
                });
                break;
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

    _createItemNumber = (event) => {
        let itemNumArray = this.state.itemNumber.split("-");

        if(event.target.id === 'itemNumberPrefix') {
            itemNumArray[0] = event.target.value;
        } else {
            itemNumArray[1] = event.target.value;
        };

        return `${itemNumArray[0]}-${itemNumArray[1].toUpperCase()}`;
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._addItem();
    }

    /* Builds user input form */
    _buildForm = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Add Item to database</h3>
                </div>
                <form onSubmit={(Event) => {this._handleFormSubmit(Event);}}>
                    <div className="modalBody">
                        <fieldset>
                            <h4 className="inputTitle">Item Number</h4>
                            <select 
                                id="itemNumberPrefix" 
                                defaultValue="" 
                                onChange={(event) => this._handleChange(itemValidation.validateItemNumberPrefix, event)}
                            >
                                <option hidden disabled value="" />
                                <option id="ituOpt" value="ITU" >ITU</option>
                                <option id="cstOpt" value="CST" >CST/KM</option>
                                <option id="afeOpt" value="AFE" >AFE</option>
                                <option id="cssOpt" value="CSS" >CSS</option>
                                <option id="supOpt" value="SUP" >SUP</option>
                                <option id="opsOpt" value="OPS" >OPS</option>
                                <option id="srmOpt" value="SRM" >SARM</option>
                                <option id="stuOpt" value="STU" >Student Actions</option>
                                <option id="regOpt" value="REG" >Registrars</option>
                                <option id="facOpt" value="FAC" >FacD</option>
                                <option id="mtlOpt" value="MTL" >MTL</option>
                                <option id="othOpt" value="OTH" >Other</option>
                            </select>
                            {this._displayErrorMessage("itemNumberPrefix")}
                            <input 
                                type="text" 
                                id="itemNumberIdentifier"
                                placeholder="5 digit identifier"
                                className={this._returnErrorDetails("itemNumberIdentifier") ? "invalid" : "valid"}
                                value={this.state.itemNumberIdentifier} 
                                onChange={(event) => {this._handleChange(itemValidation.validateItemNumberIdentifier, event)}}
                                onBlur={(event) => this._handleBlur(itemValidation.validateItemNumberIdentifier, event)}
                            />
                            {this._displayErrorMessage("itemNumberIdentifier")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Name</h4>
                            <input 
                                type="text" 
                                id="name"
                                className={this._returnErrorDetails("name") ? "invalid" : "valid"}
                                value={this.state.name} 
                                onChange={(Event) => this._handleChange(itemValidation.validateName, Event)}
                                onBlur={(Event) => this._handleBlur(itemValidation.validateName, Event)}
                            />
                            {this._displayErrorMessage("name")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Description</h4>
                            <input 
                                type="text" 
                                id="description" 
                                className={this._returnErrorDetails("description") ? "invalid" : "valid"}
                                value={this.state.description}
                                onChange={(Event) => this._handleChange(itemValidation.validateDescription, Event)}
                                onBlur={(Event) => this._handleBlur(itemValidation.validateDescription, Event)}
                            />
                            {this._displayErrorMessage("description")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Serial Number</h4>
                            <input 
                                type="text" 
                                id="serialNumber" 
                                className={this._returnErrorDetails("serialNumber") ? "invalid" : "valid"}
                                value={this.state.serialNumber} 
                                onChange={(Event) => this._handleChange(itemValidation.validateSerialNumber, Event)}
                                onBlur={(Event) => this._handleBlur(itemValidation.validateSerialNumber, Event)}
                            />
                            {this._displayErrorMessage("serialNumber")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Notes</h4>
                            <textarea
                                type="text"
                                id="notes"
                                rows='2'
                                cols='21'
                                maxLength={100}
                                className={this._returnErrorDetails("notes") ? "invalid" : "valid"}
                                value={this.state.notes} 
                                onChange={(Event) => this._handleChange(itemValidation.validateNotes, Event)}
                                onBlur={(Event) => this._handleBlur(itemValidation.validateNotes, Event)}
                                ></textarea>
                            {this._displayErrorMessage("notes")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Home Location</h4>
                            <input 
                                type="text" 
                                id="homeLocation" 
                                className={ this._returnErrorDetails("homeLocation") ? "invalid" : "valid"}
                                value={this.state.homeLocation} 
                                onChange={(Event) => this._handleChange(itemValidation.validateLocation, Event)}
                                onBlur={(Event) => this._handleBlur(itemValidation.validateLocation, Event)}
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
                                onChange={(Event) => this._handleChange(itemValidation.validateSpecificLocation, Event)}
                                onBlur={(Event) => this._handleBlur(itemValidation.validateSpecificLocation, Event)}
                            />
                            {this._displayErrorMessage("specificLocation")}
                        </fieldset>
                    </div>
                    <div className="modalFooter">
                        <input 
                            type="submit" 
                            value="Submit" 
                            disabled={!this._isSubmitAvailable()}
                        />
                        <button type="reset" onClick={this._dismissModal}>
                            Close
                        </button>
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