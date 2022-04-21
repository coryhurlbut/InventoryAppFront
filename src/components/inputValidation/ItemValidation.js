import validator 		from "validator";

import { sanitizeData } from "."

/*
name:               this.state.name,
description:        this.state.description,
serialNumber:       this.state.serialNumber,
notes:              this.state.notes,
homeLocation:       this.state.homeLocation,
specificLocation:   this.state.specificLocation,
*/
class ItemValidation {
	
	/* Validates data and produces errors*/
	validateItemNumberPrefix(itemNumberPrefix) {
		if(itemNumberPrefix === '') {
			return "Please select the itemNumber prefix";
		};

		return false;
	}

	validateItemNumberIdentifier(itemNumberIdentifier) {
		let sanitizedItemNumber = sanitizeData.sanitizeWhitespace(itemNumberIdentifier);
		
		if(validator.isEmpty(sanitizedItemNumber)) {
			return 'Please provide a 5 digit identifier';
		} else if(!validator.isAlphanumeric(sanitizedItemNumber, 'en-US')) {
			return '-_- letters and numbers only';
		} else if(!validator.isLength(sanitizedItemNumber, {min:5, max:5})) {
			return 'Item Number identifier must be 5 characters';
		};
		return false;
	}
	

	validateName(name) {
		let santizedName = sanitizeData.sanitizeWhitespace(name);
		
		if(validator.isEmpty(santizedName)) {
			return 'Please provide a name';
		} else if(!validator.isAlphanumeric(santizedName, 'en-US', {ignore: /[\s-]/})) {
			return '-_- letters and numbers only';
		} else if(!validator.isLength(santizedName, {min:1, max:25})) {
			return 'Name cannot exceed 25 characters';
		};
		
		return false;
	}

	validateDescription(description) {
		let santizedDescription = sanitizeData.sanitizeWhitespace(description);

		if(validator.isEmpty(santizedDescription)) {
			return 'Please provide a description';
		} else if(!validator.isAlphanumeric(santizedDescription, 'en-US', {ignore: " -"})) {
			return '-_- letters and numbers only';
		} else if(!validator.isLength(santizedDescription, {min:1, max:25})) {
			return 'Description cannot exceed 25 characters';
		};

		return false;
	}

	validateSerialNumber(serialNumber) {
		let santizedSerialNum = sanitizeData.sanitizeWhitespace(serialNumber);

		if(validator.isEmpty(santizedSerialNum)) {
			return 'Please provide a Serial Number';
		} else if(!validator.isAlphanumeric(santizedSerialNum, 'en-US', {ignore: "-"})) {
			return '-_- letters and numbers only';
		} else if(!validator.isLength(santizedSerialNum, {min:1, max:25})) {
			return 'Serial Number cannot exceed 25 characters';
		};

		return false;
	}

	validateNotes(notes) {
		let santizedNotes = sanitizeData.sanitizeWhitespace(notes);

		//Notes isn't a required field, so if empty, return no error
		if(validator.isEmpty(santizedNotes)) {
			return false;
		} else if(!validator.isAlphanumeric(santizedNotes, 'en-US', {ignore: " -,.':"})) {
			return '-_- letters and numbers only';
		};

		return false;
	}

	validateLocation(homeLocation) {
		let santizedHomeLoc = sanitizeData.sanitizeWhitespace(homeLocation);

		if(validator.isEmpty(santizedHomeLoc)) {
			return 'Please provide a location';
		} else if(!validator.isAlphanumeric(santizedHomeLoc, 'en-US', {ignore: " -"})) {
			return '-_- letters and numbers only';
		} else if(!validator.isLength(santizedHomeLoc, {min:1, max:15})) {
			return 'Home Location cannot exceed 15 characters';
		};

		return false;
	}

	validateSpecificLocation(specificLocation) {
		let santizedLocation= sanitizeData.sanitizeWhitespace(specificLocation);

		if(validator.isEmpty(santizedLocation)) {
			return 'Please provide a specific location ';
		} else if(!validator.isAlphanumeric(santizedLocation, 'en-US', {ignore: " -"})) {
			return '-_- letters and numbers only';
		} else if(!validator.isLength(santizedLocation, {min:1, max:15})) {
			return 'Specific Location cannot exceed 15 characters';
		};

		return false;
	}

	validateSubmit(name, description, homeLocation, specificLocation, serialNumber) {
		if(
			validator.isEmpty(name) || 
			validator.isEmpty(description) || 
			validator.isEmpty(homeLocation) || 
			validator.isEmpty(specificLocation) || 
			validator.isEmpty(serialNumber
		)) {
			return false;
		};

		return true;
	}
}

const itemValidation = new ItemValidation();

export default itemValidation;