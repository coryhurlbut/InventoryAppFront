import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    adminLogController }    from '../../controllers';
import { itemValidation,
    sanitizeData,
    HandleOnChangeEvent }   from '../inputValidation';

/*
*   Modal for adding an item
*/
const MODAL_HEADER_TITLE = 'Add Item to database';

const INPUT_FIELD_ITEM_NUMBER = 'Item Number';
const INPUT_FIELD_NAME = 'Name';
const INPUT_FIELD_DESCRIPTION = 'Description';
const INPUT_FIELD_SERIAL_NUMBER = 'Serial Number';
const INPUT_FIELD_NOTES = 'Notes';
const INPUT_FIELD_HOME_LOCATION = 'Home Location';
const INPUT_FIELD_SPECIFIC_LOCATION = 'Specific Location';

const BTN_CLOSE = 'Close';

export default class AddItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen                  : props.isOpen,
            itemNumber              : 'AAA-AAAAA',
            itemNumberPrefix        : '',
            itemNumberIdentifier    : '',
            name                    : '',
            description             : '',
            serialNumber            : '',
            notes                   : '',
            homeLocation            : '',
            specificLocation        : '',
            available               : true,
            disabled                : true,
            isError                 : false,
            errorMessage            : ''
        };
        this.handleInputFields = new HandleOnChangeEvent('itemModalAdd');
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _addItem = async () => {
        let item = {};
        //If the user enters something into notes, date stamp it
        if(this.state.notes !== '') {
            let currentDate = new Date();
            let currentDateISOString = currentDate.toISOString();
    
            let newNotes = (`${this.state.notes + '`' + currentDateISOString + '`'}`);
    
            item = {
                itemNumber          : this.state.itemNumber,
                name                : this.state.name,
                description         : this.state.description,
                serialNumber        : this.state.serialNumber,
                notes               : newNotes,
                homeLocation        : this.state.homeLocation,
                specificLocation    : this.state.specificLocation,
                available           : this.state.available,
            };
        } else { //Pass default emptry string
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
        }


        let returnedItem = {};

        await itemController.createItem(item)
        .then((data) => {
            if(data.status !== undefined && data.status >= 400) throw data;
            
            this.setState({ 
                isError: false, 
                errorMessage: '' 
            });
            returnedItem = data;
            window.location.reload();
            this._dismissModal();
        })
        .catch( async (err) => {            
            this.setState({ 
                isError: true, 
                errorMessage: err.message 
            }); 
        });

        //Uses the new item _id to make a log to the admin log of the new item being added
        let log = {
            itemId      : returnedItem.itemNumber,
            userId      : 'N/A',
            adminId     : '',
            action      : 'add',
            content     : 'item'
        };

        //TODO: add error handling for log API calls
        await adminLogController.createAdminLog(log);
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

    _handleChangeEvent = (Event, methodCall) => {
        let inputFieldID = Event.target.id;
        let inputFieldValue = Event.target.value;

        this.handleInputFields.handleEvent(Event, methodCall);

        if(inputFieldID === 'itemNumberPrefix') {
            this.setState({ 
                itemNumberPrefix: sanitizeData.sanitizeWhitespace(inputFieldValue),
                itemNumber      : this._createItemNumber(Event)
            });
        } else if(inputFieldID === 'itemNumberIdentifier') {
            this.setState({ 
                itemNumberIdentifier: sanitizeData.sanitizeWhitespace(inputFieldValue),
                itemNumber          : this._createItemNumber(Event)
            });
        } else {
            this.setState({ [inputFieldID]: sanitizeData.sanitizeWhitespace(inputFieldValue) });
        }
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._addItem();
    }

    /* Builds user input form */
    _renderForm = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_TITLE}</h3>
                </div>
                <form data-testid="form" onSubmit={(Event) => {this._handleFormSubmit(Event);}}>
                    <div className="modalBody">
                        {this.state.isError ?
                            this._renderErrorMessage() :
                            null
                        }
                        <fieldset className={INPUT_FIELD_ITEM_NUMBER}>
                            <h4 className="inputTitle">{INPUT_FIELD_ITEM_NUMBER}</h4>
                            <select 
                                id="itemNumberPrefix" 
                                defaultValue="" 
                                className={this.handleInputFields.setClassNameIsValid("itemNumberPrefix") ? "valid" : "invalid"}
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateItemNumberPrefix)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateItemNumberPrefix)}
                            >
                                <option hidden disabled value="" />
                                <option id="ituOpt" value="ITU" label='ITU'/>
                                <option id="cstOpt" value="CST" label='CST/KM'/>
                                <option id="afeOpt" value="AFE" label='AFE'/>
                                <option id="cssOpt" value="CSS" label='CSS'/>
                                <option id="supOpt" value="SUP" label='SUP'/>
                                <option id="opsOpt" value="OPS" label='OPS'/>
                                <option id="srmOpt" value="SRM" label='SARM'/>
                                <option id="stuOpt" value="STU" label='Student Actions'/>
                                <option id="regOpt" value="REG" label='Registrars'/>
                                <option id="facOpt" value="FAC" label='FacD'/>
                                <option id="mtlOpt" value="MTL" label='MTL'/>
                                <option id="othOpt" value="OTH" label='Other'/>
                            </select>
                            {this.handleInputFields.setErrorMessageDisplay("itemNumberPrefix")}
                            <input 
                                type="text" 
                                id="itemNumberIdentifier"
                                placeholder="5 digit identifier"
                                className={this.handleInputFields.setClassNameIsValid("itemNumberIdentifier") ? "valid" : "invalid"}
                                value={this.state.itemNumberIdentifier} 
                                onChange={(Event) => {this._handleChangeEvent(Event, itemValidation.validateItemNumberIdentifier)}}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateItemNumberIdentifier)}
                            />
                            {this.handleInputFields.setErrorMessageDisplay("itemNumberIdentifier")}
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
                                className={this.handleInputFields.setClassNameIsValid("description") ? "valid" : "invalid"}
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
                                className={this.handleInputFields.setClassNameIsValid("serialNumber") ? "valid" : "invalid"}
                                value={this.state.serialNumber} 
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateSerialNumber)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateSerialNumber)}
                            />
                            {this.handleInputFields.setErrorMessageDisplay("serialNumber")}
                        </fieldset>
                        <fieldset className={INPUT_FIELD_NOTES}>
                            <h4 className="inputTitle">{INPUT_FIELD_NOTES}</h4>
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
                            {this.handleInputFields.setErrorMessageDisplay("notes")}
                        </fieldset>
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
                        <input 
                            type="submit" 
                            value="Submit" 
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
                *{this.state.errorMessage}
            </label>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this._renderForm()}
            </Modal>
        );
    }
}