import GenericController from './GenericController';

/*
*   Controls functions calling APIs for AdminLog data operations
*/
class AdminLogController extends GenericController{
    
    //Gets all admin logs
    async getAllAdminLogs() {
        let adminLogs;
        await this.request('logs/adminLogs', {method: 'GET'})
            .then((res) => res.json())
            .then((adminLog) => adminLogs = adminLog);
        return adminLogs;
    };

    //Gets admin logs by item Id
    async getAdminLogsByItemId(itemId) {
        let adminLogs;
        await this.request(`logs/adminLogs/item/${itemId}`, {method: 'GET'})
            .then((res) => res.json())
            .then((adminLog) => adminLogs = adminLog);
        return adminLogs;
    };

    //Gets admin logs by user Id
    async getAdminLogsByUserId(userId) {
        let adminLogs;
        await this.request(`logs/adminLogs/user/${userId}`, {method: 'GET'})
            .then((res) => res.json())
            .then((adminLog) => adminLogs = adminLog);
        return adminLogs;
    };

    //Creates an admin log. Must have required adminLog data
    async createAdminLog(adminLog) {
        return await this.request('logs/adminLogs', {method: 'POST', body: adminLog});
    };

    //Delete an admin log
    async deleteAdminLog(logId) {
        return await this.request(`logs/adminLogs/${logId}`, {method: 'DELETE'});
    };
};

//Exports an instance of the class instead of the class
const adminLogController = new AdminLogController();
export default adminLogController;