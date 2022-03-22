import React                from 'react';
import { Modal }            from '@fluentui/react';
import itemController       from '../../controllers/ItemController';
import adminLogController   from '../../controllers/AdminLogController';

import { validateFields } from '../InputValidation/itemValidation';
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
            selectedObjects:  props.selectedObjects,
            errorDetails:     {
                field:            '',
                errorMessage:     ''
            },
            errors:                 [],
            isControllerError:      false,
            controllerErrorMessage: ''
        };
    };

    async componentDidMount(){
        try {
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
        } catch (error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ isControllerError: true,
                            controllerErrorMessage: "An error occured while loading. Please refresh and try again."});
        }
    };

    dismissModal() {
        this.setState({ isOpen: false });
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

        await itemController.updateItem(this.state.idArray[0], item)
        .then(async (auth) => {
            if ( auth.status !== undefined && auth.status >= 400 ) throw auth;
            this.setState({ isControllerError: false, 
                            controllerErrorMessage: ''});
            
            await adminLogController.createAdminLog(log);

            window.location.reload();
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ isControllerError: true, 
                controllerErrorMessage: err.message});
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
        return <label className='emptyLabel'>This is filler</label>;
    };

    /* When an errorDetail is no longer present, remove from errors list */
    handleRemoveError(fieldID){
        const updatedErrors = this.state.errors.filter(errorDetails => errorDetails.field !== fieldID);
        this.setState({ errors: updatedErrors });
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

        /* If something is returned from the passed function, an error occured 
            since an error was returned, set the error state if not already set
        */
        if(!this.returnErrorDetails(fieldID) && validationFunc(fieldVal)){   //Does the error already exist? no
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
        } else if(!validationFunc(fieldVal)){
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
    
    /* Builds user input form */
    buildForm(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Edit Item</h3>
            </div>
            <form onSubmit={(Event) => {Event.preventDefault(); this.editItem();}}>
                <div className='modalBody'>
                    <fieldset>
                        <h4 className='inputTitle'>Name</h4>
                        <input 
                            type='text' 
                            id='name'
                            className={ this.returnErrorDetails('name') ? 'invalid' : 'valid'}
                            value={this.state.name} 
                            onChange={(evt) => this.handleChange(validateFields.validateName, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateName, evt)}/>
                        { this.displayErrorMessage('name') }
                    </fieldset>
                    <fieldset>
                        <h4 className='inputTitle'>Description</h4>
                        <input 
                            type='text' 
                            id='description' 
                            className={ this.returnErrorDetails('description') ? 'invalid' : 'valid'}
                            value={this.state.description}
                            onChange={(evt) => this.handleChange(validateFields.validateDescription, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateDescription, evt)}/>
                        { this.displayErrorMessage('description') }
                    </fieldset>
                    <fieldset>
                        <h4 className='inputTitle'>Serial Number</h4>
                        <input 
                            type='text' 
                            id='serialNumber' 
                            className={ this.returnErrorDetails('serialNumber') ? 'invalid' : 'valid'}
                            value={this.state.serialNumber} 
                            onChange={(evt) => this.handleChange(validateFields.validateSerialNumber, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateSerialNumber, evt)}/>
                        { this.displayErrorMessage('serialNumber') }
                    </fieldset>
                    <fieldset>
                        <h4 className='inputTitle'>Notes</h4>
                        <input 
                            type='text' 
                            id='notes' 
                            className={ this.returnErrorDetails('notes') ? 'invalid' : 'valid'}
                            value={this.state.notes} 
                            onChange={(evt) => this.handleChange(validateFields.validateNotes, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateNotes, evt)}/>
                        { this.displayErrorMessage('notes') }
                    </fieldset>
                    <fieldset>
                        <h4 className='inputTitle'>Home Location</h4>
                        <input 
                            type='text' 
                            id='homeLocation' 
                            className={ this.returnErrorDetails('homeLocation') ? 'invalid' : 'valid'}
                            value={this.state.homeLocation} 
                            onChange={(evt) => this.handleChange(validateFields.validateLocation, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateLocation, evt)}/>
                        { this.displayErrorMessage('homeLocation') }
                    </fieldset>
                    <fieldset>
                        <h4 className='inputTitle'>Specific Location</h4>
                        <input 
                            type='text' 
                            id='specificLocation' 
                            className={ this.returnErrorDetails('specificLocation') ? 'invalid' : 'valid'}
                            value={this.state.specificLocation} 
                            onChange={(evt) => this.handleChange(validateFields.validateSpecificLocation, evt)}
                            onBlur={(evt) => this.handleBlur(validateFields.validateSpecificLocation, evt)}/>
                        { this.displayErrorMessage('specificLocation') }
                    </fieldset>
                </div>
                <div className='modalFooter'>
                    { this.isSumbitAvailable() ? <input type='submit' value='Submit'></input> : <input type='submit' value='Submit' disabled></input>}
                    <button type="reset" onClick={() => this.dismissModal()}>Close</button>
                </div>
            </form>
            </>
        );
    };

    /* If a backend issue occurs, display message to user */
    buildErrorDisplay(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Error Has Occured</h3>
            </div>
            <div className='modalBody'>
                <p className='errorMesage'> {this.state.controllerErrorMessage} </p>
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
                { this.state.isControllerError ? this.buildErrorDisplay() : this.buildForm() }
            </Modal>
        );
    };
};