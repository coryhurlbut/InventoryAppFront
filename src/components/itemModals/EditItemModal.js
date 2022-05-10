import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    adminLogController }    from '../../controllers';
import { itemValidation,
    sanitizeData,
    HandleOnChangeEvent }   from '../inputValidation';
import { ViewNoteModal }   from '../logModals';
import MapNotes             from '../utilities/MapNotes';

/*
*   Modal for editing an item
*/
const MODAL_HEADER_TITLE = 'Edit Item';
const MODAL_HEADER_ERROR_TITLE = 'Error Has Occured';

const INPUT_FIELD_ITEM_NUMBER = 'Item Number';
const INPUT_FIELD_NAME = 'Name';
const INPUT_FIELD_DESCRIPTION = 'Description';
const INPUT_FIELD_SERIAL_NUMBER = 'Serial Number';
const INPUT_FIELD_NOTES = 'Notes';
const VIEW_NOTES = 'View';
const INPUT_FIELD_HOME_LOCATION = 'Home Location';
const INPUT_FIELD_SPECIFIC_LOCATION = 'Specific Location';

const BTN_CLOSE = 'Close';

export default class EditItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen                  : props.isOpen,
            itemNumber              : '',
            name                    : '',
            description             : '',
            serialNumber            : '',
            notes                   : '',
            previousNotes           : '',
            homeLocation            : '',
            specificLocation        : '',
            available               : true,
            reload                  : props.reload,
            isControllerError       : false,
            controllerErrorMessage  : '',
            isError                 : false,
            errorMessage            : '',
            modal                   : null
        };
        this._selectedIds       = props.selectedIds;
        this._selectedObjects   = props.selectedObjects;
        
        this.handleInputFields = new HandleOnChangeEvent('itemModalEdit');
    }

    async componentDidMount() {
        try {
            const res = await itemController.getItemByItemNumber(this._selectedIds[0]);
            const {
                itemNumber,
                name,
                description,
                serialNumber,
                notes,
                homeLocation,
                specificLocation,
                available 
            } = res[0];
            this.setState({ notesArrayFinal: MapNotes(notes) })
            
            this.setState({
                itemNumber          : itemNumber,
                name                : name,
                description         : description,
                serialNumber        : serialNumber,
                homeLocation        : homeLocation,
                specificLocation    : specificLocation,
                available           : available,
                previousNotes       : notes
            });
        } catch(error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({
                isControllerError       : true,
                controllerErrorMessage  : "An error occured while loading. Please refresh and try again."
            });
        }
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
        if(this.state.reload){
            window.location.reload();
        }
    }

    _editItem = async () => {
        let item = {};
        let currentDate = new Date();
        let currentDateISOString = currentDate.toISOString();
        let updatedNotes;

        item = {
            itemNumber          : this.state.itemNumber,
            name                : this.state.name,
            description         : this.state.description,
            serialNumber        : this.state.serialNumber,
            notes               : this.state.notes,
            homeLocation        : this.state.homeLocation,
            specificLocation    : this.state.specificLocation,
            available           : this.state.available,
        };

        //Are there existing notes to append new notes to?
        if(this.state.previousNotes !== '') {
            //Are there notes to append?
                //If not, pass just the already existing notes
            if(this.state.notes !== '') {
                updatedNotes = (`${this.state.previousNotes + this.state.notes + '`' + currentDateISOString + '`'}`);
            } else {
                updatedNotes = (`${this.state.previousNotes}`);
            }

            item.notes = updatedNotes;
        } else { //Notes either has information or doesn't
            if(this.state.notes !== '') {
                updatedNotes = (`${this.state.notes + '`' + currentDateISOString + '`'}`);
                item.notes = updatedNotes;
            }
        }

        let log = {
            itemId      : item.itemNumber,
            userId      : 'N/A',
            adminId     : '',
            action      : 'edit',
            content     : 'item'
        };
        
        await itemController.updateItem(item)
        .then(async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ 
                isError: false, 
                errorMessage: ''
            });
            
            await adminLogController.createAdminLog(log);

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ 
                isError: true, 
                errorMessage: err.message
            });
        });
    }

    _openNotesModal = () => {
        this.setState({
            modal: <ViewNoteModal 
                selectedIds={this._selectedIds}
                selectedObjects={this.selectedObjects}
                isOpen={true} 
                content={this.state.notesArrayFinal} 
                name={`${this.state.name}`} 
                hideModal={this._hideModal}
                />
        });
    }
    _hideModal = () => {
        this.setState({modal: null});
    };
    
    _handleChangeEvent = (Event, methodCall) => {
        let inputFieldID = Event.target.id;
        let inputFieldValue = Event.target.value;

        this.handleInputFields.handleEvent(Event, methodCall);

        this.setState({ [inputFieldID]: sanitizeData.sanitizeWhitespace(inputFieldValue) });
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._editItem();
    }

    /* Builds user input form */
    _renderForm = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_TITLE}</h3>
                </div>
                <form onSubmit={(Event) => {this._handleFormSubmit(Event);}}>
                    <div className="modalBody">
                        {this.state.isError ?
                            this._renderErrorMessage() :
                            null
                        }
                        <fieldset className={INPUT_FIELD_ITEM_NUMBER}>
                            <h4 className="inputTitle">{INPUT_FIELD_ITEM_NUMBER}</h4>
                            <input 
                                type="text" 
                                id="itemNumber"
                                disabled
                                value={this.state.itemNumber}
                            />
                        </fieldset>
                        <fieldset className={INPUT_FIELD_NAME}>
                            <h4 className="inputTitle">{INPUT_FIELD_NAME}</h4>
                            <input 
                                type="text" 
                                id="name"
                                className={this.handleInputFields.setClassNameIsValid("name") ? "valid" : "invalid"}
                                value={this.state.name} 
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateName)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateName)}
                            />
                            {this.handleInputFields.setErrorMessageDisplay("name")}
                        </fieldset>
                        <fieldset className={INPUT_FIELD_DESCRIPTION}>
                            <h4 className="inputTitle">{INPUT_FIELD_DESCRIPTION}</h4>
                            <input 
                                type="text" 
                                id="description" 
                                className={ this.handleInputFields.setClassNameIsValid("description") ? "valid" : "invalid"}
                                value={this.state.description}
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateDescription)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateDescription)}
                            />
                            {this.handleInputFields.setErrorMessageDisplay("description")}
                        </fieldset>
                        <fieldset className={INPUT_FIELD_SERIAL_NUMBER}>
                            <h4 className="inputTitle">{INPUT_FIELD_SERIAL_NUMBER}</h4>
                            <input 
                                type="text" 
                                id="serialNumber" 
                                className={ this.handleInputFields.setClassNameIsValid("serialNumber") ? "valid" : "invalid"}
                                value={this.state.serialNumber} 
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateSerialNumber)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateSerialNumber)}
                            />
                            {this.handleInputFields.setErrorMessageDisplay("serialNumber")}
                        </fieldset>
                        <fieldset className={INPUT_FIELD_NOTES}>
                            <h4 className="inputTitle">{INPUT_FIELD_NOTES}</h4>
                            <span className='sideBySide'>
                                <textarea
                                    type="text"
                                    id="notes"
                                    rows='2'
                                    cols='21'
                                    maxLength={100}
                                    className={this.handleInputFields.setClassNameIsValid("notes") ? "valid" : "invalid"}
                                    value={this.state.notes} 
                                    onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateNotes)}
                                    onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateNotes)}
                                />
                                <button type='button' onClick={this._openNotesModal}>
                                    {VIEW_NOTES}
                                </button>
                            </span>
                            {this.handleInputFields.setErrorMessageDisplay("notes")}
                        </fieldset>
                        {this.state.modal}
                        <fieldset className={INPUT_FIELD_HOME_LOCATION}>
                            <h4 className="inputTitle">{INPUT_FIELD_HOME_LOCATION}</h4>
                            <input 
                                type="text" 
                                id="homeLocation" 
                                className={ this.handleInputFields.setClassNameIsValid("homeLocation") ? "valid" : "invalid"}
                                value={this.state.homeLocation} 
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateHomeLocation)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateHomeLocation)}
                            />
                            {this.handleInputFields.setErrorMessageDisplay("homeLocation")}
                        </fieldset>
                        <fieldset className={INPUT_FIELD_SPECIFIC_LOCATION}>
                            <h4 className="inputTitle">{INPUT_FIELD_SPECIFIC_LOCATION}</h4>
                            <input 
                                type="text" 
                                id="specificLocation" 
                                className={ this.handleInputFields.setClassNameIsValid("specificLocation") ? "valid" : "invalid"}
                                value={this.state.specificLocation} 
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateSpecificLocation)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateSpecificLocation)} 
                            />
                            {this.handleInputFields.setErrorMessageDisplay("specificLocation")}
                        </fieldset>
                    </div>
                    <div className="modalFooter">
                        <input type='submit' 
                            value='Submit' 
                            disabled={!this.handleInputFields.isItemModalSubmitAvailable()} 
                        />
                        <button type="reset" onClick={this._dismissModal}>
                            {BTN_CLOSE}
                        </button>
                    </div>
                </form>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.controllerErrorMessage}
            </label>
        );
    };

    /* If a backend issue occurs, display message to user */
    _renderErrorDisplay = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_ERROR_TITLE}</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">{this.state.controllerErrorMessage}</p>
                </div>
                <div className="modalFooter">
                    <button type="reset" onClick={this._dismissModal}>
                        {BTN_CLOSE}
                    </button>
                </div>
            </>
        );
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this.state.isControllerError ? this._renderErrorDisplay() : this._renderForm()}
            </Modal>
        );
        
    }
}