/*
*   Controller to be used by the other controllers. Holds main auth request functions that will be used in all controllers.
*/
export default class AuthController {
    constructor(props) {
        this.buildApiUrl    = this.buildApiUrl.bind(this);
        this.request        = this.requestWithAuth.bind(this);
        this.refreshToken   = this.refreshToken.bind(this);
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
    };

    clearLocalStorage () {
        localStorage.clear();
    };

    async refreshToken() {
        console.log('refreshToken')
        let refreshToken = this.getRefreshToken();
        console.log(refreshToken)
        let auth = await this.requestWithAuth('auth/refresh', {method: 'POST', body: JSON.stringify({refreshToken: refreshToken})});
        console.log(auth)
        return auth;
    };

    async checkToken() {
        const refreshToken = this.getRefreshToken();
        if (refreshToken !== null) {
            let auth = await this.refreshToken(refreshToken);
            console.log(auth)
            return auth;
        };
    };

    isJSON(objToCheck) {
        let jsonObject;
        try {
            jsonObject = objToCheck.json();
            return jsonObject;
        } catch (error) {
            if (error.name == "TypeError") {
                return objToCheck;
            };
        };
    };

    //Custom request function to add headers
    async requestWithAuth (url, initObj) {
        initObj['headers'] = {
            'Accept':           'application/json',
            'Content-Type':     'application/json',
            'Authorization':    `Bearer ${this.getAccessToken()}` || null
        };

        try {
            let response = await fetch(this.buildApiUrl(url), initObj).then((res) => {
                return this.isJSON(res);
            });
            
            console.log(response);
            if (response.status == 403) {
                throw "jwt expired"
            }
            return response;
        } catch (err) {

            if (err === "jwt expired") {
                console.log('expired')
                this.refreshToken();
            };
        };
    };
};

//Exports an instance of the class instead of the class
export const authController = new AuthController();