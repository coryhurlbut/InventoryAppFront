import validator from "validator";
import { sanitizeData } from "./sanitizeData"

/*
firstname
lastname
username
userRole
password
phonenumber
*/
class ValidateFields{

  /* Validates data and produces errors*/
  validateFirstName(firstname){
    let santizedFirstName = sanitizeData.sanitizeWhitespace(firstname);
    
    if (validator.isEmpty(santizedFirstName)) {
      return 'Please provide a first name';
    } else if (!validator.isAlpha(santizedFirstName, 'en-US', {ignore: '[\s-]'})) {
      return '-_- letters only';
    } else if(!validator.isLength(santizedFirstName, {min:1, max:25})){
      return 'Name cannot exceed 25 characters'
    }
    return false;
  }
  validateLastName(lastname){
    let santizedLastName = sanitizeData.sanitizeWhitespace(lastname);
    
    if (validator.isEmpty(santizedLastName)) {
      return 'Please provide a last name';
    } else if (!validator.isAlpha(santizedLastName, 'en-US', {ignore: '[\s-]'})) {
      return '-_- letters only';
    } else if(!validator.isLength(santizedLastName, {min:1, max:25})){
      return 'Name cannot exceed 25 characters'
    }
    return false;
  }
  validateUserName(username){
    let santizedUserName = sanitizeData.sanitizeWhitespace(username);
    
    if (validator.isEmpty(santizedUserName)) {
      return 'Please provide a username';
    } else if (!validator.isAlphanumeric(santizedUserName, 'en-US', {ignore: '[\s-_]'})) {
      return '-_- letters and numbers only';
    } else if(!validator.isLength(santizedUserName, {min:6, max:25})){
      return 'Username must be between 6 and 25 characters'
    }
    return false;
  }
  validateUserRole(userRole){
    
    if(userRole === ''){
        return 'Please select which role the user will have';
    }
    return false;
  }
  validatePassword(isRequired, password){
    if(isRequired){
        if(!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
            return 'Must contain at least 1 lowercase, 1 uppercase, 1 number, 1 symbol. Minimum Length: 8';
        }
    }
      return false;
  }
  validatePasswordConfirm(password, confirmPassword) {
    if(password !== confirmPassword) {
      return 'Passwords must match';
    }
    return false;
  }
  validatePhoneNumber(phoneNumber){
      if(!validator.isMobilePhone(phoneNumber)){
        return 'Please enter associated number';
      }
      return false;
  }

  validateSubmit(firstName, lastName, userName, userRole, phoneNumber, isRequired, password){
    if(validator.isEmpty(firstName) || validator.isEmpty(lastName) || validator.isEmpty(userName) || validator.isEmpty(phoneNumber) || userRole === '' || (isRequired && validator.isEmpty(password))){
      return false;
    }
    return true;
  }
}

const validateFields = new ValidateFields();

export { validateFields };