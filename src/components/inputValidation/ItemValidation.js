import validator 		from "validator";

import { sanitizeData } from "."

const OUTPUT_ITEM_NUMBER_PREFIX = 'Please select the itemNumber prefix';
const OUTPUT_ITEM_NUMBER_IDENTIFIER_EMPTY = 'Please provide a 5 digit identifier';
const OUTPUT_ITEM_NUMBER_IDENTIFIER_LENGTH = 'Item Number identifier must be 5 characters';

const OUTPUT_NAME_EMPTY = 'Please provide a name';
const OUTPUT_NAME_LENGTH = 'Name cannot exceed 25 characters';

const OUTPUT_DESCRIPTION_EMPTY = 'Please provide a description';
const OUTPUT_DESCRIPTION_LENGTH = 'Description cannot exceed 25 characters';

const OUTPUT_SERIAL_NUMBER_EMPTY = 'Please provide a Serial Number';
const OUTPUT_SERIAL_NUMBER_LENGTH = 'Serial Number cannot exceed 25 characters';

const OUTPUT_NOTES_LENGTH = 'Notes cannot exceed 100 characters';

const OUTPUT_HOME_LOCATION_EMPTY = 'Please provide a Home Location';
const OUTPUT_HOME_LOCATION_LENGTH = 'Home Location cannot exceed 15 characters';

const OUTPUT_SPECIFIC_LOCATION_EMPTY = 'Please provide a Specific Location';
const OUTPUT_SPECIFIC_LOCATION_LENGTH = 'Specific Location cannot exceed 15 characters';

const CONTENT_RESTRICTION_ALPHANUMERIC = 'Enter only a-z/A-Z/0-9';

/*	Used for the itemModals to ensure backend requirements are met
	Item Input Fields:
		name:               this.state.name,
		description:        this.state.description,
		serialNumber:       this.state.serialNumber,
		notes:              this.state.notes,
		homeLocation:       this.state.homeLocation,
		specificLocation:   this.state.specificLocation,
	Return:
		False - meaning no error in user input was found
		Specific String - tailored error message to display to the userlabs 
*/
class ItemValidation {
	/* 
		itemNumber Prefix is a dropdown, default is set to an empty string
	*/
	validateItemNumberPrefix(itemNumberPrefix) {
		if(itemNumberPrefix === '') {
			return OUTPUT_ITEM_NUMBER_PREFIX;
		};
		return false;
	}
	/* 
		itemNumber Identifier is user input:
			cannot be emtpy
			Allowed numbers and letters
			set length of 5 characters
	*/
	validateItemNumberIdentifier(itemNumberIdentifier) {
		let sanitizedItemNumber = sanitizeData.sanitizeWhitespace(itemNumberIdentifier);
		
		if(validator.isEmpty(sanitizedItemNumber)) {
			return OUTPUT_ITEM_NUMBER_IDENTIFIER_EMPTY;
		} else if(!validator.isAlphanumeric(sanitizedItemNumber, 'en-US')) {
			return CONTENT_RESTRICTION_ALPHANUMERIC;
		} else if(!validator.isLength(sanitizedItemNumber, {min:5, max:5})) {
			return OUTPUT_ITEM_NUMBER_IDENTIFIER_LENGTH;
		};
		return false;
	}
	/* 
		name is user input:
			cannot be emtpy
			Allowed numbers and letters, exception first instance of a space and a dash
			Max length of 25 characters
	*/
	validateName(name) {
		let santizedName = sanitizeData.sanitizeWhitespace(name);
		if(validator.isEmpty(santizedName)) {
			return OUTPUT_NAME_EMPTY;
		} else if(!validator.isAlphanumeric(santizedName, 'en-US', {ignore: /[\s-]/})) {
			return CONTENT_RESTRICTION_ALPHANUMERIC;
		} else if(!validator.isLength(santizedName, {min:1, max:25})) {
			return OUTPUT_NAME_LENGTH;
		};
		return false;
	}
	/* 
		Description is user input:
			cannot be emtpy
			Allowed numbers and letters, exception all space and dash characters
			Max length of 25 characters
	*/
	validateDescription(description) {
		let santizedDescription = sanitizeData.sanitizeWhitespace(description);

		if(validator.isEmpty(santizedDescription)) {
			return OUTPUT_DESCRIPTION_EMPTY;
		} else if(!validator.isAlphanumeric(santizedDescription, 'en-US', {ignore: " -"})) {
			return CONTENT_RESTRICTION_ALPHANUMERIC;
		} else if(!validator.isLength(santizedDescription, {min:1, max:25})) {
			return OUTPUT_DESCRIPTION_LENGTH;
		};
		return false;
	}
	/* 
		Serial Number is user input:
			cannot be emtpy
			Allowed numbers and letters, exception all dash characters
			Max length of 25 characters
	*/
	validateSerialNumber(serialNumber) {
		let santizedSerialNum = sanitizeData.sanitizeWhitespace(serialNumber);

		if(validator.isEmpty(santizedSerialNum)) {
			return OUTPUT_SERIAL_NUMBER_EMPTY;
		} else if(!validator.isAlphanumeric(santizedSerialNum, 'en-US', {ignore: "-"})) {
			return CONTENT_RESTRICTION_ALPHANUMERIC;
		} else if(!validator.isLength(santizedSerialNum, {min:1, max:25})) {
			return OUTPUT_SERIAL_NUMBER_LENGTH;
		};
		return false;
	}
	/* 
		Notes is user input:
			Can be empty
			Allowed numbers and letters, exception all space, dash, comma, period, apostrophe, and colon characters
			Max length of 100 characters
	*/
	validateNotes(notes) {
		let santizedNotes = sanitizeData.sanitizeWhitespace(notes);

		//Notes isn't a required field, so if empty, return no error
		if(validator.isEmpty(santizedNotes)) {
			return false;
		} else if(!validator.isAlphanumeric(santizedNotes, 'en-US', {ignore: " -,.':"})) {
			return CONTENT_RESTRICTION_ALPHANUMERIC;
		} else if(!validator.isLength(santizedNotes, {min:1, max:100})) {
			return OUTPUT_NOTES_LENGTH;
		};
		return false;
	}
	/* 
		Home Location is user input:
			cannot be emtpy
			Allowed numbers and letters, exception all space and dash characters
			Max length of 15 characters
	*/
	validateHomeLocation(homeLocation) {
		let santizedHomeLoc = sanitizeData.sanitizeWhitespace(homeLocation);

		if(validator.isEmpty(santizedHomeLoc)) {
			return OUTPUT_HOME_LOCATION_EMPTY;
		} else if(!validator.isAlphanumeric(santizedHomeLoc, 'en-US', {ignore: " -"})) {
			return CONTENT_RESTRICTION_ALPHANUMERIC;
		} else if(!validator.isLength(santizedHomeLoc, {min:1, max:15})) {
			return OUTPUT_HOME_LOCATION_LENGTH;
		};
		return false;
	}
	/* 
		Specific Location is user input:
			cannot be emtpy
			Allowed numbers and letters, exception all space and dash characters
			Max length of 15 characters
	*/
	validateSpecificLocation(specificLocation) {
		let santizedLocation= sanitizeData.sanitizeWhitespace(specificLocation);

		if(validator.isEmpty(santizedLocation)) {
			return OUTPUT_SPECIFIC_LOCATION_EMPTY;
		} else if(!validator.isAlphanumeric(santizedLocation, 'en-US', {ignore: " -"})) {
			return CONTENT_RESTRICTION_ALPHANUMERIC;
		} else if(!validator.isLength(santizedLocation, {min:1, max:15})) {
			return OUTPUT_SPECIFIC_LOCATION_LENGTH;
		};
		return false;
	}
}

const itemValidation = new ItemValidation();

export default itemValidation;