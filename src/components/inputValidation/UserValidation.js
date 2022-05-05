import validator from 'validator';

import { sanitizeData } from '.';

const OUTPUT_FIRST_NAME_EMPTY = 'Please provide a first name';
const OUTPUT_FIRST_NAME_LENGTH = 'First Name cannot exceed 25 characters';

const OUTPUT_LAST_NAME_EMPTY = 'Please provide a last name';
const OUTPUT_LAST_NAME_LENGTH = 'Last Name cannot exceed 25 characters';

const OUTPUT_USERNAME_EMPTY = 'Please provide a username';
const OUTPUT_USERNAME_LENGTH = 'Username must be between 6-25 charcters';

const OUTPUT_PASSWORD_MIN_LENGTH = 'Invalid Password. Minimum Length: 8';
const OUTPUT_PASSWORD_MIN_LOWERCASE = 'Invalid Password. Minimum one lowercase letter';
const OUTPUT_PASSWORD_MIN_UPPERCASE = 'Invalid Password. Minimum one uppercase letter';
const OUTPUT_PASSWORD_MIN_NUMBER = 'Invalid Password. Minimum one number';
const OUTPUT_PASSWORD_MIN_SPECIAL_CHAR = 'Invalid Password. Minimum one special character';

const OUTPUT_CONFIRM_PASSWORD = 'Passwords must match';

const OUTPUT_PHONE_NUMBER = 'Please enter a valid phone number';

const CONTENT_RESTRICTION_ALPHANUMERIC = 'Enter only a-z/A-Z/0-9';
const CONTENT_RESTRICTION_ALPHA = 'Enter only a-z/A-Z';
const INVALID_PASSWORD = 'Invalid character used';

class UserValidation {

	/* Validates data and produces errors*/
	validateFirstName(firstname) {
		let santizedFirstName = sanitizeData.sanitizeWhitespace(firstname);
		
		if(validator.isEmpty(santizedFirstName)) {
			return OUTPUT_FIRST_NAME_EMPTY;
		} else if(!validator.isAlpha(santizedFirstName, 'en-US', {ignore: /[\s-]/})) {
			return CONTENT_RESTRICTION_ALPHA;
		} else if(!validator.isLength(santizedFirstName, {min:1, max:25})) {
			return OUTPUT_FIRST_NAME_LENGTH;
		};
		return false;
	}

	validateLastName(lastname) {
		let santizedLastName = sanitizeData.sanitizeWhitespace(lastname);
		
		if(validator.isEmpty(santizedLastName)) {
			return OUTPUT_LAST_NAME_EMPTY;
		} else if(!validator.isAlpha(santizedLastName, 'en-US', {ignore: /[\s-]/})) {
			return CONTENT_RESTRICTION_ALPHA;
		} else if(!validator.isLength(santizedLastName, {min:1, max:25})) {
			return OUTPUT_LAST_NAME_LENGTH;
		};
		return false;
	}

	validateUserName(username) {
		let santizedUserName = sanitizeData.sanitizeWhitespace(username);
		
		if(validator.isEmpty(santizedUserName)) {
			return OUTPUT_USERNAME_EMPTY;
		} else if(!validator.isAlphanumeric(santizedUserName, 'en-US', {ignore: " -_"})) {
			return CONTENT_RESTRICTION_ALPHANUMERIC;
		} else if(!validator.isLength(santizedUserName, {min:6, max:25})){
			return OUTPUT_USERNAME_LENGTH;
		};
		return false;
	}

	validatePassword(isRequired, password) {
		let passwordRegex = new RegExp(/^[a-zA-Z0-9!@#$%^&*_+]+$/);
		if(!isRequired) return false;

		if(!validator.isStrongPassword(password, {minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0})) {
			return OUTPUT_PASSWORD_MIN_LENGTH;
		} else if(!validator.isStrongPassword(password, {minLength: 0, minLowercase: 1, minUppercase: 0, minNumbers: 0, minSymbols: 0})) {
			return OUTPUT_PASSWORD_MIN_LOWERCASE;
		} else if(!validator.isStrongPassword(password, {minLength: 0, minLowercase: 0, minUppercase: 1, minNumbers: 0, minSymbols: 0})) {
			return OUTPUT_PASSWORD_MIN_UPPERCASE;
		} else if(!validator.isStrongPassword(password, {minLength: 0, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0})) {
			return OUTPUT_PASSWORD_MIN_NUMBER;
		} else if(!validator.isStrongPassword(password, {minLength: 0, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 1})) {
			return OUTPUT_PASSWORD_MIN_SPECIAL_CHAR;
		};

		if(!passwordRegex.test(password)) {return INVALID_PASSWORD};

		return false;
	}

	validateConfirmPassword(password, confirmPassword) {
		if(password !== confirmPassword) {
			return OUTPUT_CONFIRM_PASSWORD;
		};
		return false;
	}

	validatePhoneNumber(phoneNumber) {
		const validateNumber = new RegExp(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
		
		if(!validateNumber.test(phoneNumber) || !validator.isLength(phoneNumber, {min:10, max: 14})) {
			return OUTPUT_PHONE_NUMBER;
		};
		return false;
	}
}

const userValidation = new UserValidation();

export default userValidation;