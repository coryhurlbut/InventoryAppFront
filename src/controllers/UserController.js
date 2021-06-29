import GenericController from './GenericController';

/* 
*   Controls functions calling APIs for User data operations
*/
class UserController extends GenericController{

    //Gets all users
    async getAllUsers() {
        let usersList;
        await this.request('users', {method: 'GET'})
            .then((res) => res.json())
            .then((users) => usersList = users);
        return usersList;
    };

    //Gets a single user by Id
    async getUserById(userId) {
        let user = await this.request(`users/${userId}`, {method: 'GET'})
            .then((res) => res.json());
        return user;
    };

    //Creates a single user. Must be given body of all required user fields
    async createUser(user) {
        return await this.request('users', {method: 'POST', body: user});
    };

    //Deletes a single user by Id
    async deleteUser(userId) {
        return await this.request(`users/${userId}`, {method: 'DELETE'});
    };

    //Updates a single user. Must pass the user's Id and the new user data
    async updateUser(userId, user) {
        return await this.request(`users/${userId}`, {method: 'PATCH', body: user});
    };
};

//Exports an instance of the class instead of the class
const userController = new UserController();
export default userController;