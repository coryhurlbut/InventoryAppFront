import validator from "validator";

/*
name:               this.state.name,
description:        this.state.description,
serialNumber:       this.state.serialNumber,
notes:              this.state.notes,
homeLocation:       this.state.homeLocation,
specificLocation:   this.state.specificLocation,
*/
class SanitizeData{
    sanitizeWhitespace(data){
        if(validator.trim(data).length === 0){
            let sanData = validator.trim(data)
            return sanData;
        }
        return data;
    }
}

const sanitizeData = new SanitizeData();

export { sanitizeData };