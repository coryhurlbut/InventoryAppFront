import validator from "validator";
import { sanitizeData } from "./sanitizeData"

/*
name:               this.state.name,
description:        this.state.description,
serialNumber:       this.state.serialNumber,
notes:              this.state.notes,
homeLocation:       this.state.homeLocation,
specificLocation:   this.state.specificLocation,
*/
class ValidateFields{

  /* Validates data and produces errors*/
  validateName(name){
    let santizedName = sanitizeData.sanitizeWhitespace(name);
    
    if (validator.isEmpty(santizedName)) {
      return 'Please provide a name';
    } else if (!validator.isAlphanumeric(santizedName, 'en-US', {ignore: '[\s-]'})) {
      return '-_- letters and numbers only';
    } else if(!validator.isLength(santizedName, {min:1, max:50})){
      return 'Name cannot exceed 50 characters'
    }
    return false;
  }

  validateDescription(description){
    let santizedDescription = sanitizeData.sanitizeWhitespace(description);

    if (validator.isEmpty(santizedDescription)) {
      return 'Please provide a description';
    } else if (!validator.isAlphanumeric(santizedDescription, 'en-US', {ignore: '[\s-]'})) {
      return '-_- letters and numbers only';
    }
    return false;
  }

  validateLocation(homeLocation){
    let santizedHomeLoc = sanitizeData.sanitizeWhitespace(homeLocation);

    if (validator.isEmpty(santizedHomeLoc)) {
      return 'Please provide a location';
    } else if (!validator.isAlphanumeric(santizedHomeLoc, 'en-US', {ignore: '[\s-]'})) {
      return '-_- letters and numbers only';
    }
    return false;
  }

  validateSpecificLocation(specificLocation){
    let santizedLocation= sanitizeData.sanitizeWhitespace(specificLocation);

    if (validator.isEmpty(santizedLocation)) {
      return 'Please provide a specific location ';
    } else if (!validator.isAlphanumeric(santizedLocation, 'en-US', {ignore: '[\s-]'})) {
      return '-_- letters and numbers only';
    }
    return false;
  }

  validateSerialNumber(serialNumber){
    let santizedSerialNum = sanitizeData.sanitizeWhitespace(serialNumber);

    if (validator.isEmpty(santizedSerialNum)) {
      return 'Please provide a Serial Number';
    } else if (!validator.isAlphanumeric(santizedSerialNum, 'en-US', {ignore: '[\s-]'})) {
      return '-_- letters and numbers only';
    }
    return false;
  }
  
  validateNotes(notes){
    let santizedNotes = sanitizeData.sanitizeWhitespace(notes);

    //Notes isn't a required field, so if empty, return no error
    if(validator.isEmpty(santizedNotes)){
      return false;
    }
    else if (!validator.isAlphanumeric(santizedNotes, 'en-US', {ignore: '[\s-]'})) {
      return '-_- letters and numbers only';
    }
    return false;
  }

  validateSubmit(name, description, homeLocation, specificLocation, serialNumber){
    if(validator.isEmpty(name) || validator.isEmpty(description) || validator.isEmpty(homeLocation) || validator.isEmpty(specificLocation) || validator.isEmpty(serialNumber)){
      return false;
    }
    return true;
  }
}

const validateFields = new ValidateFields();

export { validateFields };