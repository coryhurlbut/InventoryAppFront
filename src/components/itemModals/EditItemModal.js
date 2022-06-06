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

let notes = '';

export default class EditItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen                  : props.isOpen,
            reload                  : props.reload,
            isControllerError       : false,
            controllerErrorMessage  : '',
            isError                 : false,
            errorMessage            : '',
            modal                   : null,
            accountRole             : props.accountRole,
            notesArrayFinal         : null,
            oldItem                 : {
                itemNumber: '',
                name: '',
                description: '',
                serialNumber: '',
                notes: '',
                homeLocation: '',
                specificLocation: '',
                available: ''
            },
            newItem                 : {
                itemNumber: '',
                name: '',
                description: '',
                serialNumber: '',
                notes: '',
                homeLocation: '',
                specificLocation: '',
                available: ''
            }
        };
        this._selectedIds       = props.selectedIds;
        this._selectedObjects   = props.selectedObjects;
        
        this.handleInputFields = new HandleOnChangeEvent('itemModalEdit');
    }

    /**
     * TODO: possible rework on logic, we have to make an old item and new item object from database
     * to allow view notes modal to pop up properly, and all the edit item information to be remembered
     * This is also to track notes from database from view notes and the notes the user added
     */
    async componentDidMount() {
        try {
            const res = await itemController.getItemByItemNumber(this._selectedIds[0]);
            notes = res[0].notes;
            this.setState({ 
                notesArrayFinal: MapNotes(notes),
                oldItem: {
                    itemNumber: res[0].itemNumber,
                    name: res[0].name,
                    description: res[0].description,
                    serialNumber: res[0].serialNumber,
                    notes: '',
                    homeLocation: res[0].homeLocation,
                    specificLocation: res[0].specificLocation,
                    available: res[0].available
                },
                newItem: {
                    itemNumber: res[0].itemNumber,
                    name: res[0].name,
                    description: res[0].description,
                    serialNumber: res[0].serialNumber,
                    notes: '',
                    homeLocation: res[0].homeLocation,
                    specificLocation: res[0].specificLocation,
                    available: res[0].available
                },
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

    //method to call database for editing an item, there is also variables to create a time stamp
    //for a successful note entry
    _editItem = async () => {
        let item = {};
        let currentDate = new Date();
        let currentDateISOString = currentDate.toISOString();
        let updatedNotes;

        item = {
            itemNumber: this.state.newItem.itemNumber,
            name: this.state.newItem.name,
            description: this.state.newItem.description,
            serialNumber: this.state.newItem.serialNumber,
            notes: this.state.newItem.notes,
            homeLocation: this.state.newItem.homeLocation,
            specificLocation: this.state.newItem.specificLocation,
            available: this.state.newItem.available
        }

        //Are there existing notes to append new notes to?
        if(notes !== '') {
            //Are there notes to append?
                //If not, pass just the already existing notes
            if(this.state.newItem.notes !== '') {
                updatedNotes = (`${notes + this.state.newItem.notes + '`' + currentDateISOString + '`'}`);
            } else {
                updatedNotes = (`${notes}`);
            }

            item.notes = updatedNotes;
        } else { //Notes either has information or doesn't
            if(this.state.newItem.notes !== '') {
                updatedNotes = (`${this.state.newItem.notes + '`' + currentDateISOString + '`'}`);
                item.notes = updatedNotes;
            }
        }

        //log for the edit event
        let log = {
            itemId      : item.itemNumber,
            userId      : 'N/A',
            adminId     : '',
            action      : 'edit',
            content     : 'item'
        };
        //database call
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

    //calls viewnote modal component ontop of edit item modal
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

        this.setState({ [inputFieldID]: sanitizeData.sanitizeWhitespace(inputFieldValue)});

        this.setState(prevState => ({
            newItem:{
                ...prevState.newItem,
                [inputFieldID]: sanitizeData.sanitizeWhitespace(inputFieldValue)
            }
        }));
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
                    {this.state.accountRole === 'admin' ? <div><div className="modalBody">
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
                                value={this.state.newItem.itemNumber}
                            />
                        </fieldset>
                        <fieldset className={INPUT_FIELD_NAME}>
                            <h4 className="inputTitle">{INPUT_FIELD_NAME}</h4>
                            <input 
                                type="text" 
                                id="name"
                                className={this.handleInputFields.setClassNameIsValid("name") ? "valid" : "invalid"}
                                value={this.state.newItem.name} 
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
                                value={this.state.newItem.description}
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
                                value={this.state.newItem.serialNumber} 
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
                                    value={this.state.newItem.notes} 
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
                                value={this.state.newItem.homeLocation} 
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
                                className={this.handleInputFields.setClassNameIsValid("specificLocation") ? "valid" : "invalid"}
                                value={this.state.newItem.specificLocation} 
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateSpecificLocation)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateSpecificLocation)} 
                            />
                            {this.handleInputFields.setErrorMessageDisplay("specificLocation")}
                        </fieldset>
                    </div>
                    <div className="modalFooter">
                        <input type='submit' 
                            value='Submit' 
                            disabled={!this.handleInputFields.isItemModalSubmitAvailable(this.state.oldItem, this.state.newItem)} 
                        />
                        <button type="reset" onClick={this._dismissModal}>
                            {BTN_CLOSE}
                        </button>
                    </div></div> : <div>{this.state.isError ?
                            this._renderErrorMessage() :
                            null
                        }
                        <div className='modalBody'>
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
                                        value={this.state.newItem.notes} 
                                        onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateNotes)}
                                        onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateNotes)}
                                    />
                                    <button type='button' onClick={this._openNotesModal}>
                                        {VIEW_NOTES}
                                    </button>
                                </span>
                                {this.handleInputFields.setErrorMessageDisplay("notes")}
                            </fieldset>
                            </div>
                            {this.state.modal}
                                <div className="modalFooter">
                                    <input type='submit' 
                                        value='Submit' 
                                        disabled={!this.handleInputFields.isItemModalSubmitAvailable(this.state.oldItem, this.state.newItem)} 
                                    />
                                    <button type="reset" onClick={this._dismissModal}>
                                        {BTN_CLOSE}
                                    </button>
                                </div>
                        </div>
                        }
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