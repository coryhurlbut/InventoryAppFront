import GenericController from './GenericController';
import { authController } from '../controllers';
/*
 *   Controls functions calling APIs for Auth data operations
 */
export class LoginLogoutController extends GenericController {

    async logout(auth) {
        authController.deleteCookie();
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

            authController.setAccessTokenCookie(response.accessToken);
            authController.setRefreshTokenCookie(response.refreshToken);

            return response;
        } catch(err) {
            return err;
        };
    };
};

//Exports an instance of the class instead of the class
const loginLogoutController = new LoginLogoutController();
export default loginLogoutController;