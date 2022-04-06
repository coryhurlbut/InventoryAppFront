import jwtDecode from "jwt-decode";

/*
*   Controller to be used by the other controllers. Holds main auth request functions that will be used in most controllers.
*/
export class AuthController {
    constructor(props) {
        this.buildApiUrl    = this.buildApiUrl.bind(this);
        this.request        = this.requestWithAuth.bind(this);
        this.refreshToken   = this.refreshToken.bind(this);
    };
    
    // Uses the URL in the environment variable and the relative path from the controller to build the full API URL
    buildApiUrl (url) {
        return process.env.REACT_APP_HOSTNAME + url;
    };

    // Gets accessToken from the cookies
    getAccessToken() {
        let returnValue = null;
        let cookies = document.cookie;

        //Cookies saved as "name1=value1;name2=value2"
            /*replaced map with forEach to remove warning error: 
                Expected to return a value in arrow function  array-callback-return*/
        cookies.split('; ').forEach(cookie => {
            if (cookie.split('=')[0] === 'accessToken') {
                returnValue = decodeURIComponent(cookie.split('=')[1]);
            }
        });
        return returnValue;
    };

    // Gets refreshToken from the cookies
    getRefreshToken() {
        let cookies = document.cookie;
        let returnValue = null;

        //Cookies saved as "name1=value1;name2=value2"
            /*replaced map with forEach to remove warning error: 
                    Expected to return a value in arrow function  array-callback-return*/
        cookies.split('; ').forEach(cookie => {
            if (cookie.split('=')[0] === 'refreshToken') {
                returnValue = decodeURIComponent(cookie.split('=')[1]);
            };
        });

        return returnValue;
    };

    //Sets refresh token into a cookie
    setRefreshTokenCookie(refreshToken) {
        document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; Secure`;
    }

    //Sets access token into a cookie with expiration
    setAccessTokenCookie(accessToken) {
        document.cookie = `accessToken=${encodeURIComponent(accessToken)}; Secure`;
    }

    //Removes the value of the tokens in the cookies
    deleteCookie() {
        document.cookie = `refreshToken=${null}`;
        document.cookie = `accessToken=${null}`;
    }

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
            body: JSON.stringify({ refreshToken: refreshToken })
        };

        // Makes request to refresh, gets the response in json, then takes the data out and stores in auth
        await fetch(this.buildApiUrl('auth/refresh'), initObj).then(res => res.json()).then(data => auth = data).catch(err => auth = new Error(err));

        if (auth.message && auth.message.split(' ')[0] === 'TypeError:') {return auth.message};
        // If no auth data or incorrect token, return undefined 
        if (auth === undefined || auth.message !== undefined) {return undefined};

        this.setAccessTokenCookie(auth.accessToken);

        return auth;
    };

    // Checks if accessToken is expired or not. Returns true if valid
    checkTokenExpiration() {
        // jwtDecode is an imported library. It decodes the payload but can't verify or decode the signed secret on the token
        let decodedToken = this.getUserInfo();
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

    // gets current logged in user info from token
    getUserInfo() {
        try {
            let user = jwtDecode(this.getAccessToken());
            return user;
        } catch (error) {
            return {
                ...error,
                status: 500,
                message: 'Expired Token'
            }
        }
    }

    // Custom request function to add headers for authenticated requests
    async requestWithAuth (url, initObj) {
        // Checks if access token is expired. If it is, refreshes token before making request.
        if (!this.checkTokenExpiration()) {
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
            if (response.status >= 400) {
                throw await response.json();
            };
            return await response.json();
        } catch (err) {
            // Example error form to return -> {"message":"Password is incorrect","instance":"unknown","status":400}
            return err.error;
        };
    };
};

//Exports an instance of the class instead of the class
const authController = new AuthController();
export default authController;