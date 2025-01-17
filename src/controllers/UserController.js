import {AuthController} from './AuthController';
import {genericController} from './GenericController';

/* 
*   Controls functions calling APIs for User data operations
*/
class UserController extends AuthController {

    //Gets all users
    async getAllUsers() {
        return await this.requestWithAuth('users', {method: 'GET'});
    };

    //Gets all active users
    async getAllActiveUsers() {
        return await this.requestWithAuth('users/active', {method: 'GET'});
    }
    //gets those users with status of pending, for admin approve modal
    async getPendingUsers() {
        return await this.requestWithAuth('users/pending', {method: 'GET'});
    }

    //Gets a single user by Id
    async getUserByUserName(userName) { 
        let response = await this.requestWithAuth(`users/${userName}`, {method: 'GET'});
        
        //Gets user info to send to editUserModal for preventing user from changing their own role.
        let user = this.getUserInfo();
        response.adminUserName = user.user.user.userName;

        return response;
    }

    //the slightly different route for a new user requesting access, which still adds to the database as pending
    async registerNewUser(userRegister){
        return await genericController.request('users/new', {method: 'POST', body: JSON.stringify(userRegister)});
    }
    //Creates a single user. Must be given body of all required user fields
    async createUser(user) {
        return await this.requestWithAuth('users', {method: 'POST', body: JSON.stringify(user)});
    }

    // //Deletes a single user by Id
    async deleteUsers(users) {
        return await this.requestWithAuth(`users/delete`, {method: 'DELETE', body: JSON.stringify(users)});
    }

    //Activates users. Must pass the userNames in a JSON array
    async activateUsers(users) {
        return await this.requestWithAuth(`users/activate`, {method: 'PATCH', body: JSON.stringify(users)});
    }

    //Deactivates users. Must pass the userNames in a JSON array
    async deactivateUsers(users) {
        return await this.requestWithAuth(`users/deactivate`, {method: 'PATCH', body: JSON.stringify(users)});
    }

    //Updates a single user. Must pass the new user data
    async updateUser(user) {
        return await this.requestWithAuth(`users/${user.userName}`, {method: 'PATCH', body: JSON.stringify(user)});
    }

    //Checks if users have items signed out to them. Called before delete or deactivating a user.
    async checkSignouts(users, items) {
        let res = { status: '', message: ''};

        items.forEach(item => {
            if(users.length > 1) {
                /*replaced map with forEach to remove warning error: 
                    Expected to return a value in arrow function  array-callback-return*/
                users.forEach(user => {
                    if (item.possessedBy === user.userName) {
                        res.status = 'error';
                        res.message = 'Cannot delete or deactivate a user while they have an item signed out';
                        return res;
                    }
                })
            } else {
                if(item.possessedBy === users[0].userName) {
                    res.status = 'error';
                    res.message = 'Cannot delete or deactivate a user while they have an item signed out';
                    return res;
                }
            }
        });
        
        return res;
    }
}

//Exports an instance of the class instead of the class
const userController = new UserController();
export default userController;