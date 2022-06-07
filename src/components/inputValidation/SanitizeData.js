import validator from "validator";

/* 
    Takes user input and preps it for the database
*/
class SanitizeData{
    /* 
        Removes any tailing and leading whitespace
            user can't just input whitespace and submit anything
    */
    sanitizeWhitespace(data) {
        if(validator.trim(data).length === 0) {
            let sanData = validator.trim(data);
            return sanData;
        };

        return data;
    }
    /* 
        Given the various ways a user can input a phone number
        take what they give and put it into the format:
            xxx-xxx-xxx
    */
    sanitizePhoneNumber(data) {
        let cleanData       = data;
        let formatter       = "-";
        let databaseReady   = "";

        cleanData = cleanData.replaceAll(' ', '');
        cleanData = cleanData.replaceAll('.', '');
        cleanData = cleanData.replaceAll('-', '');

        let reformatData = cleanData.match(/^(\d{3})(\d{3})(\d{4})$/);
        /* for the match function, given the regex conditions
            match[0] - string
            match[1] - Area code
            match[2] - Telephone Prefix
            match[3] - Line number
        */
       
        databaseReady = reformatData[1] + formatter + reformatData[2] + formatter + reformatData[3];
        
        return databaseReady;
    }
    /* 
        TODO: why is this here?
    */
    sanitizeName(data) {
        return data;
    }
}

const sanitizeData = new SanitizeData();

export default sanitizeData;