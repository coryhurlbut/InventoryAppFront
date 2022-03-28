import validator from "validator";

class SanitizeData{
    sanitizeWhitespace(data){
        if(validator.trim(data).length === 0){
            let sanData = validator.trim(data)
            return sanData;
        }
        return data;
    }

    sanitizePhoneNumber(data){
        let cleanData = data;

        let formatter = "-";
        let databaseReady = "";

        cleanData = cleanData.replaceAll(' ', '');
        cleanData = cleanData.replaceAll('.', '');
        cleanData = cleanData.replaceAll('-', '');

        let reformatData = cleanData.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        /* for the match function, given the regex conditions
            match[0] - string
            match[1] - Country code
            match[2] - Area code
            match[3] - Telephone Prefix
            match[4] - Line number
        */

        console.log(reformatData);
        //Country code is optional
        if(reformatData[1]){
            databaseReady = reformatData[1] + formatter + reformatData[2] + formatter + reformatData[3] + formatter + reformatData[4];
        }
        else{
            databaseReady = reformatData[2] + formatter + reformatData[3] + formatter + reformatData[4];
        }
        
        return databaseReady;
    }

    sanitizeName(data){

        return data;
    }
}

const sanitizeData = new SanitizeData();

export { sanitizeData };