import AuthController from './AuthController';

/* 
*   Controls functions calling APIs for User data operations
*/
class UserController extends AuthController{

    //Gets all users
    async getAllUsers() {
        return await this.requestWithAuth('users', {method: 'GET'});
    };

    //Gets all active users
    async getAllActiveUsers() {
        return await this.requestWithAuth('users/active', {method: 'GET'});
    }

    //Gets a single user by Id
    async getUserById(userId) { 
        let response = await this.requestWithAuth(`users/${userId}`, {method: 'GET'});
        
        //Gets user info to send to editUserModal for preventing user from changing their own role.
        let user = this.getUserInfo();
        response.userId = user.user.user._id;

        return response;
    };

    //Creates a single user. Must be given body of all required user fields
    async createUser(user) {
        return await this.requestWithAuth('users', {method: 'POST', body: JSON.stringify(user)});
    };

    // //Deletes a single user by Id
    async deleteUsers(userIds) {
        return await this.requestWithAuth(`users/delete`, {method: 'DELETE', body: JSON.stringify(userIds)});
    };

    //Activates users. Must pass the user ids in a JSON array
    async activateUsers(userIds) {
        return await this.requestWithAuth(`users/activate`, {method: 'PATCH', body: JSON.stringify(userIds)});
    };

    //Deactivates users. Must pass the user ids in a JSON array
    async deactivateUsers(userIds) {
        return await this.requestWithAuth(`users/deactivate`, {method: 'PATCH', body: JSON.stringify(userIds)});
    };

    //Updates a single user. Must pass the user's Id and the new user data
    async updateUser(userId, user) {
        return await this.requestWithAuth(`users/${userId}`, {method: 'PATCH', body: JSON.stringify(user)});
    };

    //Checks if users have items signed out to them. Called before delete or deactivating a user.
    async checkSignouts(users, items) {
        let res = { status: '', message: ''};

        items.forEach(item => {
            if (users.length > 1) {
                    users.map(user => {
                    if (item.possessedBy === user.userName) {
                        res.status = 'error';
                        res.message = 'Cannot delete or deactivate a user while they have an item signed out';
                        return res;
                    }
                })
            } else {
                if (item.possessedBy === users.userName) {
                    res.status = 'error';
                    res.message = 'Cannot delete or deactivate a user while they have an item signed out';
                    return res;
                }
            }
        });
        
        return res;
    }
};

//Exports an instance of the class instead of the class
const userController = new UserController();
export default userController;