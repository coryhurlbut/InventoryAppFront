import validator from 'validator';

import { sanitizeData } from '.';

class UserValidation {

	/* Validates data and produces errors*/
	validateFirstName(firstname) {
		let santizedFirstName = sanitizeData.sanitizeWhitespace(firstname);
		
		if(validator.isEmpty(santizedFirstName)) {
			return 'Please provide a first name';
		} else if(!validator.isAlpha(santizedFirstName, 'en-US', {ignore: /[\s-]/})) {
			return '-_- letters only';
		} else if(!validator.isLength(santizedFirstName, {min:1, max:25})) {
			return 'Name cannot exceed 25 characters';
		};

		return false;
	}

	validateLastName(lastname) {
		let santizedLastName = sanitizeData.sanitizeWhitespace(lastname);
		
		if(validator.isEmpty(santizedLastName)) {
			return 'Please provide a last name';
		} else if(!validator.isAlpha(santizedLastName, 'en-US', {ignore: /[\s-]/})) {
			return '-_- letters only';
		} else if(!validator.isLength(santizedLastName, {min:1, max:25})) {
			return 'Name cannot exceed 25 characters';
		};

		return false;
	}

	validateUserName(username) {
		let santizedUserName = sanitizeData.sanitizeWhitespace(username);
		
		if(validator.isEmpty(santizedUserName)) {
			return 'Please provide a username';
		} else if(!validator.isAlphanumeric(santizedUserName, 'en-US', {ignore: " -_"})) {
			return '-_- letters and numbers only';
		} else if(!validator.isLength(santizedUserName, {min:6, max:25})){
			return 'Username must be between 6 and 25 characters';
		};

		return false;
	}

	validateUserRoleSelect(userRole) {
		if(userRole === '') {
			return "Please select the user's role";
		};

		return false;
	}

	validatePassword(isRequired, password) {
		if(!isRequired) return false;

		if(!validator.isStrongPassword(password, {minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0})) {
			return 'Invalid Password. Minimum Length: 8';
		} else if(!validator.isStrongPassword(password, {minLength: 0, minLowercase: 1, minUppercase: 0, minNumbers: 0, minSymbols: 0})) {
			return 'Invalid Password. Minimum one lowercase letter';
		} else if(!validator.isStrongPassword(password, {minLength: 0, minLowercase: 0, minUppercase: 1, minNumbers: 0, minSymbols: 0})) {
			return 'Invalid Password. Minimum one uppercase letter';
		} else if(!validator.isStrongPassword(password, {minLength: 0, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0})) {
			return 'Invalid Password. Minimum one number';
		} else if(!validator.isStrongPassword(password, {minLength: 0, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 1})) {
			return 'Invalid Password. Minimum one special character';
		};

		return false;
	}

	validateConfirmPassword(password, confirmPassword) {
		if(password !== confirmPassword) {
			return 'Passwords must match';
		};

		return false;
	}

	validatePhoneNumber(phoneNumber) {
		const validateNumber = new RegExp(/(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
		
		if(!validateNumber.test(phoneNumber) || !validator.isLength(phoneNumber, {min:10, max: 14})) {
			return 'Please enter a valid number';
		};

		return false;
	}

	validateSubmit(firstName, lastName, userName, userRole, phoneNumber, isRequired, password) {
		if(validator.isEmpty(firstName) || 
			validator.isEmpty(lastName) || 
			validator.isEmpty(userName) || 
			validator.isEmpty(phoneNumber) || 
			userRole === '' || 
			(isRequired && validator.isEmpty(password))
		) {
			return false;
		};

		return true;
	}

	validateUserRequest(firstName, lastName, userName, phoneNumber){
		if(validator.isEmpty(firstName) || 
			validator.isEmpty(lastName) || 
			validator.isEmpty(userName) || 
			validator.isEmpty(phoneNumber)
		) {
			return false;
		};

		return true;
	}
}

const userValidation = new UserValidation();

export default userValidation;