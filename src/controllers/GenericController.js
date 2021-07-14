/*
*   Controller to be inherited by the other controllers. Holds main functions that will be used in all controllers.
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

    getAccessToken() {
        return localStorage.getItem('access') || null;
    };

    getRefreshToken() {
        return localStorage.getItem('refresh') || null;
    }

    clearLocalStorage () {
        localStorage.clear();
    }

    async refreshToken() {
        console.log('refreshToken')
        return await fetch(this.buildApiUrl('/auth/refresh'), {method: 'POST', body: {refreshToken: this.getRefreshToken()}})
    }

    //Custom request function to add headers
    async request (url, initObj) {
        initObj['headers'] = {
            'Accept':           'application/json',
            'Content-Type':     'application/json',
            'Authorization':    `Bearer ${this.getAccessToken()}` || null
        };
        console.log(initObj)
        try{
            return await fetch(this.buildApiUrl(url), initObj)
            
        }catch(err){
            console.log(err)
            if (err.message == 'Token Expired') {
                this.refreshToken();
            }
        }
    };
};

