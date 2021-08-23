import GenericController from './GenericController';
import AuthController from './AuthController';
/*
*   Controls functions calling APIs for Auth data operations
*/
export default class LoginLogoutController extends GenericController{
    
    async logout(auth) {
        localStorage.clear();
        return await this.request('auth/logout', {method: 'DELETE', body: JSON.stringify(auth)});
    };

    //Logs in user. Must pass userName and password
    async login(userName, password) {
        const reqBody = {
                userName: userName,
                password: password
        };

        const reqObj = {
            method: 'POST',
            body: JSON.stringify(reqBody)
        };
        
        let auth = await this.request('auth/login', reqObj);
        localStorage.clear();
        localStorage.setItem('access', auth.accessToken);
        localStorage.setItem('refresh', auth.refreshToken);

        return auth
    };
};

//Exports an instance of the class instead of the class
export const loginLogoutController = new LoginLogoutController();
