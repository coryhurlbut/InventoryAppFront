import {AuthController} from './AuthController';

/*
*   Controls functions calling APIs for ItemLog data operations
*/
class ItemLogController extends AuthController {
    
    //Gets all item logs
    async getAllItemLogs() {
        return await this.requestWithAuth('logs/itemLogs', {method: 'GET'});
    };

    //Gets all item logs by the item Id
    async getItemLogsByItemId(itemId) {
        return await this.requestWithAuth(`logs/itemLogs/item/${itemId}`, {method: 'GET'});
    };

    //Gets all item logs by the user id 
    async getItemLogsByUserId(userId) {
        return await this.requestWithAuth(`logs/itemLogs/user/${userId}`, {method: 'GET'});
    };

    //Creates an item log. Must have required itemLog data
    async createItemLog(itemLog) {
        let user = this.getUserInfo();
        itemLog.custodianId = user.user.user._id;
        return await this.requestWithAuth('logs/itemLogs', {method: 'POST', body: JSON.stringify(itemLog)});
    };

    //Deletes an item log by the log's Id
    async deleteItemLog(logId) {
        return await this.requestWithAuth(`logs/itemLogs/${logId}`, {method: 'DELETE'});
    };
};

//Exports an instance of the class instead of the class
const itemLogController = new ItemLogController();
export default itemLogController;