import AuthController from './AuthController';

/* 
*   Controls functions calling APIs for User data operations
*/
class UserController extends AuthController{

    //Gets all users
    async getAllUsers() {
        return await this.requestWithAuth('users', {method: 'GET'});
    };

    //Gets a single user by Id
    async getUserById(userId) { 
        return await this.requestWithAuth(`users/${userId}`, {method: 'GET'});
    };

    //Creates a single user. Must be given body of all required user fields
    async createUser(user) {
        return await this.requestWithAuth('users', {method: 'POST', body: JSON.stringify(user)});
    };

    //Deletes a single user by Id
    async deleteUsers(userIds) {
        return await this.requestWithAuth(`users/delete`, {method: 'DELETE', body: JSON.stringify(userIds)});
    };

    //Updates a single user. Must pass the user's Id and the new user data
    async updateUser(userId, user) {
        return await this.requestWithAuth(`users/${userId}`, {method: 'PATCH', body: JSON.stringify(user)});
    };
};

//Exports an instance of the class instead of the class
const userController = new UserController();
export default userController;