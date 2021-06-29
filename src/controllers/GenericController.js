/*
*   Controller to be inherited by the other controllers. Holds main functions that will be used in all controllers.
*/
export default class GenericController {
    constructor(auth) {
        this.auth = auth;

        this.buildApiUrl    = this.buildApiUrl.bind(this);
        this.request        = this.request.bind(this);

    };
    
    //Uses the URL in the environment variable and the relative path from the controller to build the full API URL
    buildApiUrl (url) {
        return process.env.REACT_APP_HOSTNAME + url;
    };

    //Custom request function to add headers
    async request (url, initObj) {
        initObj['headers'] = {
            'Accept':       'application/json',
            'Content-Type': 'application/json'
        };

        return await fetch(this.buildApiUrl(url), initObj);
    };

    async postRequest (url, initObj) {

        return await fetch(this.buildApiUrl(url), initObj);
    }
};

