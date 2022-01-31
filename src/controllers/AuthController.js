import jwtDecode from "jwt-decode";

/*
*   Controller to be used by the other controllers. Holds main auth request functions that will be used in most controllers.
*/
export default class AuthController {
    constructor(props) {
        this.buildApiUrl    = this.buildApiUrl.bind(this);
        this.request        = this.requestWithAuth.bind(this);
        this.refreshToken   = this.refreshToken.bind(this);
    };
    
    // Uses the URL in the environment variable and the relative path from the controller to build the full API URL
    buildApiUrl (url) {
        return process.env.REACT_APP_HOSTNAME + url;
    };

    // Gets accessToken from localStorage
    getAccessToken() {
        return localStorage.getItem('access') || undefined;
    };

    // Gets refreshToken from localStorage
    getRefreshToken() {
        return localStorage.getItem('refresh') || undefined;
    };

    // Clears localStorage
    clearLocalStorage () {
        localStorage.clear();
    };

    // Refreshes the accessToken using the refreshToken. Returns accessToken and user info
    async refreshToken() {
        // Initializes request parameters
        let auth = {};
        let refreshToken = this.getRefreshToken();
        let initObj = {
            headers: {
            "Accept":           "application/json",
            "Content-Type":     "application/json"
            }, 
            method: 'POST', 
            body: JSON.stringify({refreshToken: refreshToken})
        };

        // Makes request to refresh, gets the response in json, then takes the data out and stores in auth
        await fetch(this.buildApiUrl('auth/refresh'), initObj).then(res => res.json()).then(data => auth = data).catch(err => auth = new Error(err));

        if (auth.message && auth.message.split(' ')[0] === 'TypeError:') {return auth.message};
        // If no auth data or incorrect token, return undefined 
        if (auth === undefined || auth.message !== undefined) {return undefined};

        localStorage.setItem('access', auth.accessToken);

        return auth;
    };

    // Checks if accessToken is expired or not. Returns true if valid
    checkTokenExpiration(token) {
        // jwtDecode is an imported library. It decodes the payload but can't verify or decode the signed secret on the token
        let decodedToken = jwtDecode(token);
        let currentDate = new Date();
      
        // decodedToken.exp is in seconds, current.getTime returns milliseconds 
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          return false;
        } else {  
          return true;
        };
    };

    // Checks if there is a refreshToken in the localStorage. If there is, get a new accessToken with the 
    // refreshToken function. If not, return undefined
    async checkToken() {
        let auth;
        const refreshToken = this.getRefreshToken();
        
        if (refreshToken !== undefined) {
            auth = await this.refreshToken(refreshToken);
            return auth;
        }else{
            return undefined;
        };
    };

    // Returns JSON if it is able. Otherwise, returns what was sent to it
    async isJSON(objToCheck) {
        let jsonObject;
        try {
            // Awaits .json function to get the response in JSON
            jsonObject = await objToCheck.json();
            return jsonObject;
        } catch (error) {
            // If .json fails, return original data
            if (error.name === "TypeError") {
                return objToCheck;
            };
        };
    };

    // Custom request function to add headers for authenticated requests
    async requestWithAuth (url, initObj) {
        // Checks if access token is expired. If it is, refreshes token before making request.
        if (!this.checkTokenExpiration(this.getAccessToken())) {
            await this.refreshToken();
        };
        
        // Initializes headers for making a request with authentication
        initObj['headers'] = {
            'Accept':           'application/json',
            'Content-Type':     'application/json',
            'Authorization':    `Bearer ${this.getAccessToken()}` || null
        };

        try {
            // Make request with given API path and method
            let response = await fetch(this.buildApiUrl(url), initObj)
            if (response.ok) {
                response = await response.json();
            } else {
                throw response;
            }
            return response;
        } catch (err) {
            // TODO: Implement error handling
            return err;
        };
    };
};

// Exports an instance of the class instead of the class
export const authController = new AuthController();