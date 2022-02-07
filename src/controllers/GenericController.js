/*
*   Controller to be used by the other controllers. Holds main request functions that will be used in controllers.
*/
export default class GenericController {
    constructor(props) {
        this.buildApiUrl    = this.buildApiUrl.bind(this);
        this.request        = this.request.bind(this);
    };
    
    //Uses the URL in the environment variable and the relative path from the controller to build the full API URL
    buildApiUrl (url) {
        return process.env.REACT_APP_HOSTNAME + url;
    };

    // // Returns JSON if it is able. Otherwise, returns what was sent to it
    // async isJSON(objToCheck) {
    //     let jsonObject;
    //     try {
    //         // Awaits .json function to get the response in JSON
    //         jsonObject = await objToCheck.json();
    //         return jsonObject;
    //     } catch (error) {
    //         // If .json fails, return original data
    //         if (error.name === "TypeError") {
    //             return objToCheck;
    //         };
    //     };
    // };

    //Custom request function to add headers
    async request (url, initObj) {
        initObj['headers'] = {
            'Accept':           'application/json',
            'Content-Type':     'application/json'
        };

        try {
            let response = await fetch(this.buildApiUrl(url), initObj);
            console.log(response);
            if (response.ok) {
                return await response.json();
            };
            throw response;
        } catch (err) {
            return err;
        };
    };
};

//Exports an instance of the class instead of the class
export const genericController = new GenericController();

