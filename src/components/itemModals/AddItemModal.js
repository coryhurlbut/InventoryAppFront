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
            
            isError:      false,
            errorMessage: ''
        };
        this.handleInputFields = new HandleOnChangeEvent('addItemModal');
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
            itemId:     returnedItem.itemNumber,
            userId:     'N/A',
            adminId:    '',
            action:     'add',
            content:    'item'
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

        //Update the state for whatever field is being modified
        switch(inputFieldID) {
            case 'itemNumberPrefix':
                this.setState({ 
                    itemNumberPrefix: sanitizeData.sanitizeWhitespace(inputFieldValue),
                    itemNumber: this._createItemNumber(Event)
                });
                break;
            case 'itemNumberIdentifier':
                this.setState({ 
                    itemNumberIdentifier: sanitizeData.sanitizeWhitespace(inputFieldValue),
                    itemNumber: this._createItemNumber(Event)
                });
                break;
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
        this._addItem();
    }

    /* Builds user input form */
    _renderForm = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Add Item to database</h3>
                </div>
                <form onSubmit={(Event) => {this._handleFormSubmit(Event);}}>
                    <div className="modalBody">
                        {this.state.isError ?
                            this._renderErrorMessage() :
                            null
                        }
                        <fieldset>
                            <h4 className="inputTitle">Item Number</h4>
                            <select 
                                id="itemNumberPrefix" 
                                defaultValue="" 
                                className={this.handleInputFields.setClassNameIsValid("itemNumberPrefix") ? "valid" : "invalid"}
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateItemNumberPrefix)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateItemNumberPrefix)}
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
                                className={this.handleInputFields.setClassNameIsValid("description") ? "valid" : "invalid"}
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
                                className={this.handleInputFields.setClassNameIsValid("serialNumber") ? "valid" : "invalid"}
                                value={this.state.serialNumber} 
                                onChange={(Event) => this._handleChangeEvent(Event, itemValidation.validateSerialNumber)}
                                onBlur={(Event) => this._handleChangeEvent(Event, itemValidation.validateSerialNumber)}
                            />
                            {this.handleInputFields.setErrorMessageDisplay("serialNumber")}
                        </fieldset>
                        <fieldset>
                            <h4 className="inputTitle">Notes</h4>
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
                        <input 
                            type="submit" 
                            value="Submit" 
                            disabled={!this.handleInputFields.isItemModalSubmitAvailable()}
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