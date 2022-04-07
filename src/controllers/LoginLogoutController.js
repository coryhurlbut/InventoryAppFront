import GenericController from './GenericController';
import {AuthController} from '../controllers';
/*
 *   Controls functions calling APIs for Auth data operations
 */
export default class LoginLogoutController extends GenericController {

    async logout(auth) {
        AuthController.deleteCookie();
        return await this.request('auth/logout', {
            method: 'DELETE',
            body: JSON.stringify(auth)
        });
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

        try {
            let response = await this.request('auth/login', reqObj);
            if (response.status >= 400) throw response;

            AuthController.setAccessTokenCookie(response.accessToken);
            AuthController.setRefreshTokenCookie(response.refreshToken);

            return response;
        } catch(err) {
            return err;
        };
    };
};

//Exports an instance of the class instead of the class
export const loginLogoutController = new LoginLogoutController();