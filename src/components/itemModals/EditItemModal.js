import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    adminLogController }    from '../../controllers';
import { itemValidation,
    sanitizeData,
    HandleOnChangeEvent }   from '../inputValidation';
import { ViewNotesModal }   from '../logModals';
import MapNotes             from '../utilities/MapNotes';

/*
*   Modal for editing an item
*/
export default class EditItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:           props.isOpen,
            itemNumber:       '',
            name:             '',
            description:      '',
            serialNumber:     '',
            notes:            '',
            savedNotes:       [{}],
            tempNotes:        '',
            homeLocation:     '',
            specificLocation: '',
            available:        true,
            viewNotesBool:    null,
            reload:           props.reload,
            
            isControllerError:      false,
            controllerErrorMessage: ''
        };
        this._selectedIds = props.selectedIds;
        this._selectedObjects = props.selectedObjects;
        this.handleInputFields = new HandleOnChangeEvent('editItemModal');
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
                itemNumber:             itemNumber,
                name:                   name,
                description:            description,
                serialNumber:           serialNumber,
                savedNotes:             [{notes}],
                homeLocation:           homeLocation,
                specificLocation:       specificLocation,
                available:              available,
                tempNotes:              notes
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
        if(this.state.reload){
            window.location.reload();
        }
    }

    _editItem = async () => {
        let d = Date.now();
        let now = new Date(d);
        let now1 = now.toISOString();

        let newNotes = (`${this.state.tempNotes + this.state.notes + '`' + now1 + '`'}`);
        let item = {
            itemNumber:         this.state.itemNumber,
            name:               this.state.name,
            description:        this.state.description,
            serialNumber:       this.state.serialNumber,
            notes:              newNotes,
            homeLocation:       this.state.homeLocation,
            specificLocation:   this.state.specificLocation,
            available:          this.state.available,
        };
        let log = {
            itemId:     item.itemNumber,
            userId:     'N/A',
            adminId:    '',
            action:     'edit',
            content:    'item'
        };
        
        await itemController.updateItem(item)
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

    _openNotesModal = () => {
        this.setState({ viewNotesBool: true });
    }
    
    _handleChangeEvent = (Event, methodCall) => {
        let inputFieldID = Event.target.id;
        let inputFieldValue = Event.target.value;

        this.handleInputFields.handleEvent(Event, methodCall);

        //Update the state for whatever field is being modified
        switch(inputFieldID) {
            case 'name':
                this.setState({ name: sanitizeData.sanitizeWhitespace(inputFieldValue) });
                break;
            case 'description':
                this.setState({ description: sanitizeData.sanitizeWhitespace(inputFieldValue) });
                break;
            case 'serialNumber':
                this.setState({ serialNumber: sanitizeData.sanitizeWhitespace(inputFieldValue) });
                break;
            case 'notes':
                this.setState({ notes: sanitizeData.sanitizeWhitespace(inputFieldValue) });
                break;
            case 'homeLocation':
                this.setState({ homeLocation: sanitizeData.sanitizeWhitespace(inputFieldValue) });
                break;
            case 'specificLocation':
                this.setState({ specificLocation: sanitizeData.sanitizeWhitespace(inputFieldValue) });
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
    _renderForm = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Edit Item</h3>
                </div>
                <form onSubmit={(Event) => {this._handleFormSubmit(Event);}}>
                    <div className="modalBody">
                        {this.state.isControllerError ?
                            this._renderErrorMessage() :
                            null
                        }
                        <fieldset>
                            <h4 className="inputTitle">Item Number</h4>
                            <input 
                                type="text" 
                                id="itemNumber"
                                disabled
                                value={this.state.itemNumber}
                            />
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Name</h4>
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
                        <fieldset>
                            <h4 className="inputTitle">Description</h4>
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
                        <fieldset>
                            <h4 className="inputTitle">Serial Number</h4>
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
                        <fieldset>
                            <h4 className="inputTitle">Notes</h4>
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
                                ></textarea>
                            <button type='button' onClick={this._openNotesModal}>
                                View
                            </button>
                            </span>
                            {this.handleInputFields.setErrorMessageDisplay("notes")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Home Location</h4>
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
                        <fieldset>
                            <h4 className="inputTitle">Specific Location</h4>
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
                        <button type="reset" onClick={this._dismissModal}>Close</button>
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
                    <h3>Error Has Occured</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">{this.state.controllerErrorMessage}</p>
                </div>
                <div className="modalFooter">
                    <button type="reset" onClick={this._dismissModal}>Close</button>
                </div>
            </>
        );
    }

    render() {
        if(this.state.viewNotesBool){
            return(
                <ViewNotesModal selectedIds={this._selectedIds} 
                    isOpen={true} 
                    hideModal={null} 
                    content={this.state.notesArrayFinal} 
                    name={`${this.state.name}`} 
                    previousModal={'editItem'}
                />
            );
        }
        else{
            return(
                <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                    {this.state.isControllerError ? this._renderErrorDisplay() : this._renderSignOutNotification()}
                </Modal>
            );
        }
    }
}