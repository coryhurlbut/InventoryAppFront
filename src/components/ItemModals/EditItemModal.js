import React from 'react';
import {Modal} from '@fluentui/react';
import itemController from '../../controllers/ItemController';
import adminLogController from '../../controllers/AdminLogController';
import itemLogController from '../../controllers/ItemLogController';

import { validateFields } from '../InputValidation/userValidation';
import { sanitizeData } from '../InputValidation/sanitizeData';

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
            idArray:          props.idArray,
            errorDetails:     {
                field:            '',
                errorMessage:     ''
            },
            errors:           [],
            isError:          false
        };
    };

    async componentDidMount(){
        let thisItem = await itemController.getItemById(this.state.idArray[0]);

        this.setState({
            name:             thisItem.name,
            description:      thisItem.description,
            serialNumber:     thisItem.serialNumber,
            notes:            thisItem.notes,
            homeLocation:     thisItem.homeLocation,
            specificLocation: thisItem.specificLocation,
            available:        thisItem.available
        });
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async editItem() {
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
            itemId:     this.state.idArray[0],
            userId:     'N/A',
            adminId:    '',
            action:     'edit',
            content:    'item'
        };
        try{
             await itemController.updateItem(this.state.idArray, item);
             await adminLogController.createAdminLog(log);}
        catch(err){
             err.message = 'U suck';
             
        }
        
        window.location.reload();
        this.dismissModal();
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
        if(validateFields.validateSubmit(this.state.name, this.state.description, this.state.homeLocation, this.state.specificLocation, this.state.serialNumber) && this.state.errors.length == 0){
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

        if(validationFunc(fieldVal) && isErrorSet === false){
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
                isError:          true,
                errors: [
                    ...prevState.errors,
                    errorDetail
                ]
            }));
        }
        else{
            this.setState( prevState => ({
                errorDetails: {
                    ...prevState.errorDetails,
                    field:        '',
                    errorMessage: ''
                },
                isError:          false
            }));
            this.handleRemoveError(fieldID);
        }

        //Update the state for whatever field is being modified
        switch (fieldID) {
            case 'name':
                this.setState({ name: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'description':
                this.setState({ description: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'serialNumber':
                this.setState({ serialNumber: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'notes':
                this.setState({ notes: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'homeLocation':
                this.setState({ homeLocation: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
            case 'specificLocation':
                this.setState({ specificLocation: sanitizeData.sanitizeWhitespace(fieldVal)});
                break;
                                                                                            
            default:
                break;
        }
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Edit Item</h3>
                </div>
                <form onSubmit={(Event) => {Event.preventDefault(); this.editItem();}}>
                    <div className='modalBody'>
                        <h4>Name</h4>
                        <input 
                            type='text' 
                            id='name'
                            className={ this.displayErrorMessage('name') ? 'invalid' : ''}
                            value={this.state.name} 
                            onChange={(evt) => this.handleChange(validateFields.validateName, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateName, evt)}/>
                            <br></br>
                            { this.displayErrorMessage('name') }

                        <h4>Description</h4>
                            <input 
                            type='text' 
                            id='description' 
                            className={ this.displayErrorMessage('description') ? 'invalid' : ''}
                            value={this.state.description}
                            onChange={(evt) => this.handleChange(validateFields.validateDescription, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateDescription, evt)}/>
                            <br></br>
                            { this.displayErrorMessage('description') }

                        <h4>Serial Number</h4>
                            <input 
                            type='text' 
                            id='serialNumber' 
                            className={ this.displayErrorMessage('serialNumber') ? 'invalid' : ''}
                            value={this.state.serialNumber} 
                            onChange={(evt) => this.handleChange(validateFields.validateSerialNumber, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateSerialNumber, evt)}/>
                            <br></br>
                            { this.displayErrorMessage('serialNumber') }

                        <h4>Notes</h4>
                        <input 
                            type='text' 
                            id='notes' 
                            className={ this.displayErrorMessage('notes') ? 'invalid' : ''}
                            value={this.state.notes} 
                            onChange={(evt) => this.handleChange(validateFields.validateNotes, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateNotes, evt)}/>
                            <br></br>
                            { this.displayErrorMessage('notes') }

                        <h4>Home Location</h4>
                            <input 
                            type='text' 
                            id='homeLocation' 
                            className={ this.displayErrorMessage('homeLocation') ? 'invalid' : ''}
                            value={this.state.homeLocation} 
                            onChange={(evt) => this.handleChange(validateFields.validateLocation, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateLocation, evt)}/>
                            <br></br>
                            { this.displayErrorMessage('homeLocation') }

                        <h4>Specific Location</h4>
                            <input 
                            type='text' 
                            id='specificLocation' 
                            className={ this.displayErrorMessage('specificLocation') ? 'invalid' : ''}
                            value={this.state.specificLocation} 
                            onChange={(evt) => this.handleChange(validateFields.validateSpecificLocation, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateSpecificLocation, evt)}/>
                            <br></br>
                            { this.displayErrorMessage('specificLocation') }

                    </div>
                    <div className='modalFooter'>
                        { this.isSumbitAvailable() ? <input type='submit' value='Submit'></input> : <input type='submit' value='Submit' disabled></input>}
                        <button type="reset" onClick={() => this.dismissModal()}>Close</button>
                    </div>
                </form>
            </Modal>
        );
    };
};