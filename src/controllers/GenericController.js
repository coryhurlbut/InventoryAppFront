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

    //Custom request function to add headers
    async request (url, initObj) {
        initObj['headers'] = {
            'Accept':           'application/json',
            'Content-Type':     'application/json'
        };

        try {
            return await fetch(this.buildApiUrl(url), initObj)
        } catch (err) {
            console.log(err)
        }
    };
};

//Exports an instance of the class instead of the class
export const genericController = new GenericController();

