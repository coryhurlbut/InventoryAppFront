import validator from "validator";

class SanitizeData{
    sanitizeWhitespace(data) {
        if(validator.trim(data).length === 0) {
            let sanData = validator.trim(data);
            return sanData;
        };

        return data;
    }

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

    sanitizeName(data) {
        return data;
    }
}

const sanitizeData = new SanitizeData();

export default sanitizeData;