import GenericController from './GenericController';

/*
*   Controls functions calling APIs for Auth data operations
*/
class AuthController extends GenericController{
    
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
        
        let auth = await this.postRequest('auth/login', reqObj);
        console.log(auth)
        return auth;
    };
};

//Exports an instance of the class instead of the class
const authController = new AuthController();
export default authController;