import GenericController from './GenericController';

/*
*   Controls functions calling APIs for ItemLog data operations
*/
class ItemLogController extends GenericController{
    
    //Gets all item logs
    async getAllItemLogs() {
        let itemLogs;
        await this.request('logs/itemLogs', {method: 'GET'})
            .then((res) => res.json())
            .then((itemLog) => itemLogs = itemLog);
        return itemLogs;
    };

    //Gets all item logs by the item Id
    async getItemLogsByItemId(itemId) {
        let itemLogs;
        await this.request(`logs/itemLogs/item/${itemId}`, {method: 'GET'})
            .then((res) => res.json())
            .then((itemLog) => itemLogs = itemLog);
        return itemLogs;
    };

    //Gets all item logs by the user id 
    async getItemLogsByUserId(userId) {
        let itemLogs;
        await this.request(`logs/itemLogs/user/${userId}`, {method: 'GET'})
            .then((res) => res.json())
            .then((itemLog) => itemLogs = itemLog);
        return itemLogs;
    };

    //Creates an item log. Must have required itemLog data
    async createItemLog(itemLog) {
        return await this.request('logs/itemLogs', {method: 'POST', body: JSON.stringify(itemLog)});
    };

    //Deletes an item log by the log's Id
    async deleteItemLog(logId) {
        return await this.request(`logs/itemLogs/${logId}`, {method: 'DELETE'});
    };
};

//Exports an instance of the class instead of the class
const itemLogController = new ItemLogController();
export default itemLogController;